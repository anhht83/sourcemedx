import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminUser } from './entities/admin-user.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { AdminPermission } from './entities/admin-role.entity';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import {
  ActivityType,
  EntityType,
} from '../activity-logs/entities/activity-log.entity';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

type AdminResponse = Omit<AdminUser, 'password'>;

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  @Post()
  @RequirePermissions(AdminPermission.CREATE_ADMINS)
  @ApiOperation({ summary: 'Create a new admin user' })
  @ApiResponse({
    status: 201,
    description: 'Admin user successfully created.',
    type: AdminUser,
    schema: {
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        role: { $ref: '#/components/schemas/AdminRole' },
        isActive: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request - validation error.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions.',
  })
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @Req() req: Request,
  ): Promise<AdminResponse> {
    const admin = await this.adminService.createAdmin(createAdminDto);
    await this.activityLogsService.logActivity(
      req.user as AdminUser,
      ActivityType.CREATE,
      EntityType.ADMIN,
      admin.id,
      { username: admin.username },
      req,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pass, ...result } = admin;
    return result;
  }

  @Get()
  @RequirePermissions(AdminPermission.VIEW_ADMINS)
  @ApiOperation({ summary: 'Get all admin users' })
  @ApiResponse({
    status: 200,
    description: 'List of all admin users.',
    type: [AdminUser],
    schema: {
      type: 'array',
      items: {
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          role: { $ref: '#/components/schemas/AdminRole' },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions.',
  })
  async findAll(): Promise<AdminResponse[]> {
    const admins = await this.adminService.findAll();
    return admins.map((admin) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pass, ...result } = admin;
      return result;
    });
  }

  @Get(':id')
  @RequirePermissions(AdminPermission.VIEW_ADMINS)
  @ApiOperation({ summary: 'Get an admin user by ID' })
  @ApiResponse({ status: 200, description: 'Admin user found.' })
  @ApiResponse({ status: 404, description: 'Admin user not found.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions.',
  })
  async findById(@Param('id') id: string): Promise<AdminResponse> {
    const admin = await this.adminService.findById(id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pass, ...result } = admin;
    return result;
  }

  @Put(':id')
  @RequirePermissions(AdminPermission.UPDATE_ADMINS)
  @ApiOperation({ summary: 'Update an admin user' })
  @ApiResponse({
    status: 200,
    description: 'Admin user successfully updated.',
    type: AdminUser,
  })
  @ApiResponse({ status: 404, description: 'Admin user not found.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @Req() req: Request,
  ): Promise<AdminResponse> {
    const admin = await this.adminService.update(id, updateAdminDto);
    await this.activityLogsService.logActivity(
      req.user as AdminUser,
      ActivityType.UPDATE,
      EntityType.ADMIN,
      admin.id,
      { username: admin.username },
      req,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pass, ...result } = admin;
    return result;
  }

  @Delete(':id')
  @RequirePermissions(AdminPermission.DELETE_ADMINS)
  @ApiOperation({ summary: 'Delete an admin user' })
  @ApiResponse({
    status: 200,
    description: 'Admin user successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Admin user not found.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions.',
  })
  async delete(@Param('id') id: string, @Req() req: Request): Promise<void> {
    const admin = await this.adminService.findById(id);
    await this.activityLogsService.logActivity(
      req.user as AdminUser,
      ActivityType.DELETE,
      EntityType.ADMIN,
      admin.id,
      { username: admin.username },
      req,
    );
    await this.adminService.delete(id);
  }

  @Put(':id/toggle-block')
  @RequirePermissions(AdminPermission.BLOCK_ADMINS)
  @ApiOperation({ summary: 'Toggle block status of an admin user' })
  @ApiResponse({
    status: 200,
    description: 'The admin block status has been successfully toggled.',
    type: AdminUser,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions.',
  })
  @ApiResponse({ status: 404, description: 'Admin not found.' })
  async toggleBlock(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<AdminResponse> {
    const admin = await this.adminService.toggleBlock(id);
    await this.activityLogsService.logActivity(
      req.user as AdminUser,
      admin.isActive ? ActivityType.UNBLOCK : ActivityType.BLOCK,
      EntityType.ADMIN,
      admin.id,
      { username: admin.username },
      req,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pass, ...result } = admin;
    return result;
  }

  @Get('test/error-handling')
  @RequirePermissions(AdminPermission.VIEW_ADMINS)
  @ApiOperation({ summary: 'Test endpoint for error handling' })
  @ApiResponse({
    status: 400,
    description: 'Bad request - demonstration of error handling.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions.',
  })
  testErrorHandling() {
    // This will trigger the ValidationExceptionFilter
    throw new BadRequestException([
      {
        property: 'username',
        constraints: {
          isNotEmpty: 'Username should not be empty',
          minLength: 'Username must be at least 3 characters long',
        },
      },
    ]);
  }
}
