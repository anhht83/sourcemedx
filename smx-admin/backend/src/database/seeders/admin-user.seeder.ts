import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUser } from '../../admin/entities/admin-user.entity';
import { AdminRole } from '../../admin/entities/admin-role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminUserSeeder {
  private readonly logger = new Logger(AdminUserSeeder.name);

  constructor(
    @InjectRepository(AdminUser)
    private readonly adminRepository: Repository<AdminUser>,
    @InjectRepository(AdminRole)
    private readonly roleRepository: Repository<AdminRole>,
  ) {}

  async seed(): Promise<void> {
    try {
      // Get roles
      const superAdminRole = await this.roleRepository.findOne({
        where: { name: 'SUPER_ADMIN' },
      });
      const adminRole = await this.roleRepository.findOne({
        where: { name: 'ADMIN' },
      });
      const supportRole = await this.roleRepository.findOne({
        where: { name: 'SUPPORT' },
      });

      if (!superAdminRole || !adminRole || !supportRole) {
        throw new Error(
          'Required roles not found. Please run role seeder first.',
        );
      }

      // Create admin users
      const adminUsers = [
        {
          username: 'superadmin',
          email: 'superadmin@example.com',
          password: await bcrypt.hash('SuperAdmin123!', 10),
          role: superAdminRole,
        },
        {
          username: 'admin',
          email: 'admin@example.com',
          password: await bcrypt.hash('Admin123!', 10),
          role: adminRole,
        },
        {
          username: 'support',
          email: 'support@example.com',
          password: await bcrypt.hash('Support123!', 10),
          role: supportRole,
        },
      ];

      for (const userData of adminUsers) {
        const existingUser = await this.adminRepository.findOne({
          where: [{ email: userData.email }, { username: userData.username }],
        });

        if (!existingUser) {
          const adminUser = this.adminRepository.create(userData);
          await this.adminRepository.save(adminUser);
          this.logger.log(`Created admin user: ${userData.username}`);
        } else {
          this.logger.log(`Admin user already exists: ${userData.username}`);
        }
      }

      this.logger.log('Admin users seeding completed');
    } catch (error) {
      this.logger.error('Error seeding admin users:', error);
      throw error;
    }
  }
}
