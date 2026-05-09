import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { Request } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async validateAdmin(email: string, password: string) {
    try {
      const admin = await this.adminService.validateAdmin(email, password);
      return admin;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new UnauthorizedException(error.message);
      }
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async getProfile(adminId: string) {
    const admin = await this.adminService.findById(adminId);
    return {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      isActive: admin.isActive,
      roleName: admin.role.name,
      permissions: admin.role.permissions,
    };
  }

  async login(admin: { id: string; email: string }, req: Request) {
    const payload = { id: admin.id, email: admin.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = await this.createRefreshToken(admin.id, req);

    return {
      access_token: accessToken,
      refresh_token: refreshToken.token,
    };
  }

  private async createRefreshToken(adminId: string, req: Request) {
    const tokenString = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    const refreshToken = this.refreshTokenRepository.create({
      token: tokenString,
      admin: { id: adminId },
      userAgent: req.headers['user-agent'] || 'unknown',
      ipAddress: req.ip,
      expiresAt,
    });

    return this.refreshTokenRepository.save(refreshToken);
  }

  async refreshAccessToken(refreshTokenString: string) {
    const token = await this.refreshTokenRepository.findOne({
      where: {
        token: refreshTokenString,
        isRevoked: false,
        expiresAt: MoreThan(new Date()),
      },
      relations: ['admin'],
    });

    if (!token || token.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { id: token.admin.id, email: token.admin.email };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
    };
  }

  async revokeRefreshToken(tokenId: string) {
    const token = await this.refreshTokenRepository.findOne({
      where: { id: tokenId },
    });

    if (!token) {
      throw new NotFoundException('Token not found');
    }

    token.isRevoked = true;
    await this.refreshTokenRepository.save(token);
  }

  async revokeAllRefreshTokens(adminId: string) {
    await this.refreshTokenRepository.update(
      { admin: { id: adminId }, isRevoked: false },
      { isRevoked: true },
    );
  }

  async getActiveSessions(adminId: string) {
    const sessions = await this.refreshTokenRepository.find({
      where: {
        admin: { id: adminId },
        isRevoked: false,
        expiresAt: MoreThan(new Date()),
      },
      select: ['id', 'userAgent', 'ipAddress', 'createdAt', 'expiresAt'],
    });

    return sessions;
  }
}
