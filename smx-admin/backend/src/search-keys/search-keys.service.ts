import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchKey, SearchKeyStatus } from './entities/search-key.entity';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PurchaseInfo } from './dto/purchase.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { console } from 'inspector';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class SearchKeysService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(SearchKey)
    private searchKeysRepository: Repository<SearchKey>,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.get('STRIPE_SECRET_KEY') as string,
      {
        apiVersion: '2025-06-30.basil',
      },
    );
  }

  async useSearchKey(userId: string, key: string): Promise<void> {
    const searchKey = await this.searchKeysRepository.findOne({
      where: { key, user: { id: userId } },
    });

    if (!searchKey) {
      throw new NotFoundException('Search key not found');
    }

    if (searchKey.status !== SearchKeyStatus.AVAILABLE) {
      throw new Error('Search key is not available');
    }

    if (searchKey.expiresAt < new Date()) {
      searchKey.status = SearchKeyStatus.EXPIRED;
      await this.searchKeysRepository.save(searchKey);
      throw new Error('Search key has expired');
    }

    searchKey.status = SearchKeyStatus.USED;
    searchKey.isUsed = true;
    searchKey.usedAt = new Date();
    await this.searchKeysRepository.save(searchKey);
  }

  async getUserSearchKeys(userId: string): Promise<SearchKey[]> {
    return this.searchKeysRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getSearchKeyStats(): Promise<{
    total: number;
    available: number;
    used: number;
    expired: number;
    cancelled: number;
  }> {
    const keys = await this.searchKeysRepository.find();

    return {
      total: keys.length,
      available: keys.filter((k) => k.status === SearchKeyStatus.AVAILABLE)
        .length,
      used: keys.filter((k) => k.status === SearchKeyStatus.USED).length,
      expired: keys.filter((k) => k.status === SearchKeyStatus.EXPIRED).length,
      cancelled: keys.filter((k) => k.status === SearchKeyStatus.CANCELLED)
        .length,
    };
  }

  async cancelKey(keyId: string): Promise<void> {
    const key = await this.searchKeysRepository.findOne({
      where: { id: keyId },
    });

    if (!key) {
      throw new NotFoundException('Search key not found');
    }

    if (key.status !== SearchKeyStatus.AVAILABLE) {
      throw new Error('Only available keys can be cancelled');
    }

    key.status = SearchKeyStatus.CANCELLED;
    await this.searchKeysRepository.save(key);
  }

  async getKeysByUser(userId: string): Promise<SearchKey[]> {
    return this.searchKeysRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAllSearchKeys(): Promise<{
    keys: SearchKey[];
    total: number;
  }> {
    try {
      const queryBuilder = this.searchKeysRepository
        .createQueryBuilder('key')
        .leftJoinAndSelect('key.user', 'user');

      const total = await queryBuilder.getCount();

      const keys = await queryBuilder.getMany();

      return {
        keys,
        total,
      };
    } catch (error) {
      console.log(`Error fetching search keys: ${error}`);
      throw new Error('Failed to fetch search keys');
    }
  }

  async getAllPurchases(): Promise<PurchaseInfo[]> {
    // Get all keys with user info
    const keys = await this.searchKeysRepository.find({
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
    // Group by stripePaymentId (filter out nulls)
    const groups: { [stripePaymentId: string]: SearchKey[] } = {};
    for (const key of keys) {
      if (!key.stripePaymentId) continue;
      if (!groups[key.stripePaymentId]) groups[key.stripePaymentId] = [];
      groups[key.stripePaymentId].push(key);
    }
    // Build purchase info WITHOUT Stripe payment details
    const purchases: PurchaseInfo[] = Object.entries(groups).map(
      ([stripePaymentId, group]) => {
        const user = group[0].user;
        return {
          stripePaymentId,
          user,
          count: group.length,
          totalPrice: group.reduce((sum, k) => sum + Number(k.price), 0),
          totalDiscount: group.reduce(
            (sum, k) =>
              sum +
              (k.discountApplied
                ? (Number(k.price) * 100) / (100 - Number(k.discountApplied)) -
                  Number(k.price)
                : 0),
            0,
          ),
          createdAt: group[0].createdAt,
        };
      },
    );
    return purchases;
  }

  async getPurchasePaymentDetails(stripePaymentId: string) {
    try {
      // Expand latest_charge to get the charge ID
      const paymentIntent =
        await this.stripe.paymentIntents.retrieve(stripePaymentId);
      const paymentStatus = paymentIntent.status;
      const paymentAmount = paymentIntent.amount_received / 100;
      const paymentCurrency = paymentIntent.currency;
      const paymentCreated = paymentIntent.created;

      let paymentReceiptUrl = null;
      const latestChargeId = paymentIntent.latest_charge as string | null;
      if (latestChargeId) {
        const charge = await this.stripe.charges.retrieve(latestChargeId);
        paymentReceiptUrl = charge.receipt_url;
      }
      return {
        paymentStatus,
        paymentAmount,
        paymentCurrency,
        paymentReceiptUrl,
        paymentCreated,
      };
    } catch (err) {
      return {
        paymentStatus: null,
        paymentAmount: null,
        paymentCurrency: null,
        paymentReceiptUrl: null,
        paymentCreated: null,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async expireOldKeys() {
    const now = new Date();
    await this.searchKeysRepository
      .createQueryBuilder()
      .update(SearchKey)
      .set({ status: SearchKeyStatus.EXPIRED })
      .where('expiresAt < :now', { now })
      .andWhere('status != :expired', { expired: SearchKeyStatus.EXPIRED })
      .execute();
  }

  async getAllKeyStatsByUser() {
    const keys = await this.searchKeysRepository.find({ relations: ['user'] });
    const userMap = new Map();
    for (const key of keys) {
      const user = key.user;
      if (!user) continue;
      if (!userMap.has(user.id)) {
        userMap.set(user.id, {
          user,
          keys: [],
        });
      }
      userMap.get(user.id).keys.push(key);
    }
    const result = Array.from(userMap.values()).map(
      ({ user, keys }: { user: User; keys: SearchKey[] }) => ({
        user,
        stats: {
          total: keys.length,
          available: keys.filter(
            (k: SearchKey) => k.status === SearchKeyStatus.AVAILABLE,
          ).length,
          used: keys.filter((k: SearchKey) => k.status === SearchKeyStatus.USED)
            .length,
          expired: keys.filter(
            (k: SearchKey) => k.status === SearchKeyStatus.EXPIRED,
          ).length,
          cancelled: keys.filter(
            (k: SearchKey) => k.status === SearchKeyStatus.CANCELLED,
          ).length,
        },
      }),
    );
    result.sort((a, b) => b.stats.total - a.stats.total);
    return result;
  }
}
