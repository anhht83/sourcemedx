import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { AdminUser } from './entities/admin-user.entity';
import { AdminRole } from './entities/admin-role.entity';
import * as bcrypt from 'bcrypt';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from '@nestjs/common';

@Injectable()
export class AdminService {
  private loginAttempts = new Map<
    string,
    { count: number; lastAttempt: Date }
  >();
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOGIN_TIMEOUT_MINUTES = 15;

  constructor(
    @InjectRepository(AdminUser)
    private readonly adminRepository: Repository<AdminUser>,
    @InjectRepository(AdminRole)
    private readonly roleRepository: Repository<AdminRole>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private checkLoginAttempts(email: string): void {
    const attempts = this.loginAttempts.get(email);
    if (attempts) {
      const timeDiff = new Date().getTime() - attempts.lastAttempt.getTime();
      const minutesPassed = Math.floor(timeDiff / 1000 / 60);

      if (minutesPassed >= this.LOGIN_TIMEOUT_MINUTES) {
        this.loginAttempts.delete(email);
      } else if (attempts.count >= this.MAX_LOGIN_ATTEMPTS) {
        throw new ConflictException(
          `Too many login attempts. Please try again in ${
            this.LOGIN_TIMEOUT_MINUTES - minutesPassed
          } minutes.`,
        );
      }
    }
  }

  private recordLoginAttempt(email: string, success: boolean): void {
    if (success) {
      this.loginAttempts.delete(email);
      return;
    }

    const attempts = this.loginAttempts.get(email) || {
      count: 0,
      lastAttempt: new Date(),
    };
    attempts.count += 1;
    attempts.lastAttempt = new Date();
    this.loginAttempts.set(email, attempts);
  }

  async createAdmin(createAdminDto: {
    username: string;
    email: string;
    password: string;
    roleName: string;
  }): Promise<AdminUser> {
    const { username, email, password, roleName } = createAdminDto;

    // Check if admin with username or email already exists
    const existingAdmin = await this.adminRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingAdmin) {
      throw new ConflictException('Username or email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin user
    const admin = this.adminRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    // Assign role
    const role = await this.roleRepository.findOne({
      where: { name: roleName },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    admin.role = role;

    return this.adminRepository.save(admin);
  }

  async findAll(): Promise<AdminUser[]> {
    this.logger.log('Fetching all admin users', 'AdminService');
    return this.adminRepository.find({
      relations: ['role'],
    });
  }

  async findByUsername(username: string): Promise<AdminUser> {
    const admin = await this.adminRepository.findOne({
      where: { username },
      relations: ['role'],
    });
    if (!admin) {
      throw new NotFoundException('Admin user not found');
    }
    return admin;
  }

  async findById(id: string): Promise<AdminUser> {
    this.logger.log(`Fetching admin user with ID: ${id}`, 'AdminService');

    const admin = await this.adminRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!admin) {
      this.logger.error(`Admin user not found with ID: ${id}`, 'AdminService');
      throw new NotFoundException('Admin user not found');
    }
    return admin;
  }

  async findByEmail(email: string): Promise<AdminUser> {
    const admin = await this.adminRepository.findOne({
      where: { email },
      relations: ['role'],
    });
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    return admin;
  }

  async validateAdmin(email: string, password: string): Promise<AdminUser> {
    this.checkLoginAttempts(email);

    try {
      const admin = await this.findByEmail(email);
      const isPasswordValid = await bcrypt.compare(password, admin.password);

      if (!isPasswordValid) {
        this.recordLoginAttempt(email, false);
        throw new NotFoundException('Invalid credentials');
      }

      this.recordLoginAttempt(email, true);
      return admin;
    } catch (error) {
      this.recordLoginAttempt(email, false);
      throw error;
    }
  }

  async toggleBlock(id: string): Promise<AdminUser> {
    this.logger.log(
      `Toggling block status for admin user with ID: ${id}`,
      'AdminService',
    );

    const admin = await this.findById(id);
    admin.isActive = !admin.isActive;
    return this.adminRepository.save(admin);
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<AdminUser> {
    this.logger.log(`Updating admin user with ID: ${id}`, 'AdminService');

    const admin = await this.findById(id);

    const existingAdmin = await this.adminRepository.findOne({
      where: [{ username: updateAdminDto.username, id: Not(id) }],
    });

    if (existingAdmin) {
      throw new ConflictException('Username already exists');
    }

    const role = await this.roleRepository.findOne({
      where: { name: updateAdminDto.roleName },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    admin.role = role;

    Object.assign(admin, updateAdminDto);
    return this.adminRepository.save(admin);
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting admin user with ID: ${id}`, 'AdminService');

    const admin = await this.findById(id);
    await this.adminRepository.remove(admin);
  }
}
