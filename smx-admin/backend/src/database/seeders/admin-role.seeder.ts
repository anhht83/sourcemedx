import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AdminRole,
  AdminPermission,
} from '../../admin/entities/admin-role.entity';

@Injectable()
export class AdminRoleSeeder {
  private readonly logger = new Logger(AdminRoleSeeder.name);

  constructor(
    @InjectRepository(AdminRole)
    private readonly roleRepository: Repository<AdminRole>,
  ) {}

  async seed(): Promise<void> {
    try {
      const roles = [
        {
          name: 'SUPER_ADMIN',
          description: 'Super Administrator with full access',
          permissions: [
            AdminPermission.CREATE_ADMINS,
            AdminPermission.UPDATE_ADMINS,
            AdminPermission.DELETE_ADMINS,
            AdminPermission.VIEW_ADMINS,
            AdminPermission.BLOCK_ADMINS,
            AdminPermission.VIEW_LOGS,
            AdminPermission.EXPORT_LOGS,
          ],
        },
        {
          name: 'ADMIN',
          description: 'Administrator with limited access',
          permissions: [
            AdminPermission.VIEW_ADMINS,
            AdminPermission.VIEW_LOGS,
            AdminPermission.EXPORT_LOGS,
          ],
        },
        {
          name: 'SUPPORT',
          description: 'Support staff with basic access',
          permissions: [AdminPermission.VIEW_LOGS],
        },
      ];

      for (const roleData of roles) {
        const existingRole = await this.roleRepository.findOne({
          where: { name: roleData.name },
        });

        if (!existingRole) {
          const role = this.roleRepository.create(roleData);
          await this.roleRepository.save(role);
          this.logger.log(`Created role: ${roleData.name}`);
        } else {
          this.logger.log(`Role already exists: ${roleData.name}`);
        }
      }

      this.logger.log('Admin roles seeding completed');
    } catch (error) {
      this.logger.error('Error seeding admin roles:', error);
      throw error;
    }
  }
}
