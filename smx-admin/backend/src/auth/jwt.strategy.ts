import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AdminService } from '../admin/admin.service';
import { AdminPermission } from '../admin/entities/admin-role.entity';

interface JwtPayload {
  id: string;
  email: string;
}

interface AdminPayload {
  id: string;
  email: string;
  role: {
    id: string;
    name: string;
    permissions: AdminPermission[];
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private adminService: AdminService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<AdminPayload> {
    const admin = await this.adminService.findById(payload.id);
    return {
      id: payload.id,
      email: payload.email,
      role: {
        id: admin.role.id,
        name: admin.role.name,
        permissions: admin.role.permissions,
      },
    };
  }
}
