import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AdminUser } from '../../admin/entities/admin-user.entity';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: AdminUser;
}

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AdminUser => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
