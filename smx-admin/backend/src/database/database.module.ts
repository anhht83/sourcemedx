import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminRole } from '../admin/entities/admin-role.entity';
import { AdminUser } from '../admin/entities/admin-user.entity';
import { AdminRoleSeeder } from './seeders/admin-role.seeder';
import { AdminUserSeeder } from './seeders/admin-user.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([AdminRole, AdminUser])],
  providers: [AdminRoleSeeder, AdminUserSeeder],
  exports: [AdminRoleSeeder, AdminUserSeeder],
})
export class DatabaseModule {}
