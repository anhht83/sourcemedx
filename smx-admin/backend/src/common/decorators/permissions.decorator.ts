import { SetMetadata } from '@nestjs/common';
import { AdminPermission } from '../../admin/entities/admin-role.entity';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: AdminPermission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
