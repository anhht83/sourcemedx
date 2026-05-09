import {
  Controller,
  Get,
  UseGuards,
  Req,
  Param,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { SearchKeysService } from './search-keys.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExtraModels,
} from '@nestjs/swagger';
import { Request } from 'express';
import { SearchKey, SearchKeyStatus } from './entities/search-key.entity';
import { User } from '../users/entities/user.entity';

class SearchKeyStatsResponse {
  total: number;
  available: number;
  used: number;
  expired: number;
  cancelled: number;
}

class PaginatedSearchKeysResponse {
  keys: SearchKey[];
  total: number;
}

@ApiTags('search-keys')
@Controller('search-keys')
@UseGuards(JwtAuthGuard)
@ApiExtraModels(SearchKey, SearchKeyStatsResponse, PaginatedSearchKeysResponse)
export class SearchKeysController {
  constructor(private readonly searchKeysService: SearchKeysService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get search key statistics' })
  @ApiResponse({
    status: 200,
    description: 'Returns search key statistics',
    type: SearchKeyStatsResponse,
    examples: {
      'Example Response': {
        summary: 'Example statistics response',
        value: {
          total: 100,
          available: 50,
          used: 30,
          expired: 15,
          cancelled: 5,
        },
      },
    },
  })
  async getStats() {
    return this.searchKeysService.getSearchKeyStats();
  }

  @Get('all')
  @ApiOperation({
    summary: 'Get all search keys with pagination and filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated search keys',
    type: PaginatedSearchKeysResponse,
    examples: {
      'Example Response': {
        summary: 'Example paginated search keys response',
        value: {
          keys: [
            {
              id: '123e4567-e89b-12d3-a456-426614174000',
              key: 'abc123def456',
              status: SearchKeyStatus.AVAILABLE,
              expiresAt: '2024-12-31T23:59:59Z',
              isUsed: false,
              usedAt: null,
              price: 10.0,
              discountApplied: 5.0,
              stripePaymentId: 'pi_1234567890',
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
            },
          ],
          total: 50,
        },
      },
    },
  })
  async getAllKeys() {
    return this.searchKeysService.getAllSearchKeys();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all search keys for a specific user' })
  @ApiResponse({
    status: 200,
    description: "Returns user's search keys",
    type: [SearchKey],
    examples: {
      'Example Response': {
        summary: 'Example user search keys response',
        value: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            key: 'abc123def456',
            status: SearchKeyStatus.AVAILABLE,
            expiresAt: '2024-12-31T23:59:59Z',
            isUsed: false,
            usedAt: null,
            price: 10.0,
            discountApplied: 5.0,
            stripePaymentId: 'pi_1234567890',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
      },
    },
  })
  async getKeysByUser(
    @Req() req: Request,
    @Param('userId', new ParseIntPipe()) userId: string,
  ) {
    return this.searchKeysService.getKeysByUser(userId);
  }

  @Post('cancel/:keyId')
  @ApiOperation({ summary: 'Cancel a search key' })
  @ApiResponse({
    status: 200,
    description: 'Search key cancelled successfully',
    type: SearchKey,
    examples: {
      'Example Response': {
        summary: 'Example cancelled search key response',
        value: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          key: 'abc123def456',
          status: SearchKeyStatus.CANCELLED,
          expiresAt: '2024-12-31T23:59:59Z',
          isUsed: false,
          usedAt: null,
          price: 10.0,
          discountApplied: 5.0,
          stripePaymentId: 'pi_1234567890',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      },
    },
  })
  async cancelKey(@Req() req: Request, @Param('keyId') keyId: string) {
    return this.searchKeysService.cancelKey(keyId);
  }

  @Get('purchases')
  @ApiOperation({ summary: 'Get all purchases grouped by stripePaymentId' })
  @ApiResponse({
    status: 200,
    description: 'Returns all purchases',
    type: 'array',
    isArray: true,
    examples: {
      'Example Response': {
        summary: 'Example purchases response',
        value: [
          {
            stripePaymentId: 'pi_1234567890',
            user: User,
            count: 3,
            totalPrice: 30.0,
            totalDiscount: 5.0,
            createdAt: '2024-01-01T00:00:00Z',
          },
        ],
      },
    },
  })
  async getAllPurchases() {
    return this.searchKeysService.getAllPurchases();
  }

  @Get('stats-by-user')
  @ApiOperation({ summary: 'Get all search keys stats by user' })
  @ApiResponse({
    status: 200,
    description: 'Returns all search keys stats by user',
    type: 'array',
    examples: {
      'Example Response': {
        summary: 'Example stats by user response',
        value: [
          {
            user: User,
            stats: {
              total: 10,
              available: 5,
              used: 3,
              expired: 1,
              cancelled: 1,
            },
          },
        ],
      },
    },
  })
  async getAllKeyStatsByUser() {
    return this.searchKeysService.getAllKeyStatsByUser();
  }

  @Get('payment-details/:stripePaymentId')
  @ApiOperation({ summary: 'Get payment details by stripePaymentId' })
  @ApiResponse({
    status: 200,
    description: 'Returns payment details by stripePaymentId',
    type: 'object',
    examples: {
      'Example Response': {
        summary: 'Example payment details response',
        value: {
          paymentStatus: 'succeeded',
          paymentAmount: 100,
          paymentCurrency: 'USD',
          paymentReceiptUrl: 'https://example.com/receipt',
          paymentCreated: 1718851200,
        },
      },
    },
  })
  async getPaymentDetails(@Param('stripePaymentId') stripePaymentId: string) {
    return this.searchKeysService.getPurchasePaymentDetails(stripePaymentId);
  }
}
