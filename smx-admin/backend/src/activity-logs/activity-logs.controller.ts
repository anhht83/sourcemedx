import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { AdminPermission } from '../admin/entities/admin-role.entity';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiProperty,
} from '@nestjs/swagger';
import {
  ActivityLog,
  ActivityType,
  EntityType,
} from './entities/activity-log.entity';
import { Response } from 'express';
import { PaginationDto } from './dto/pagination.dto';

class PaginatedActivityLogsResponse {
  @ApiProperty({ type: [ActivityLog] })
  items: ActivityLog[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}

@ApiTags('Activity Logs')
@ApiBearerAuth()
@Controller('activity-logs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Get()
  @RequirePermissions(AdminPermission.VIEW_LOGS)
  @ApiOperation({ summary: 'Get activity logs with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'List of activity logs',
    type: PaginatedActivityLogsResponse,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions.',
  })
  @ApiQuery({
    name: 'adminId',
    required: false,
    type: String,
    description: 'Filter logs by admin ID',
  })
  @ApiQuery({
    name: 'entityType',
    required: false,
    type: String,
    enum: EntityType,
    description: 'Filter logs by entity type',
  })
  @ApiQuery({
    name: 'activityType',
    required: false,
    type: String,
    enum: ActivityType,
    description: 'Filter logs by activity type',
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('adminId') adminId?: string,
    @Query('entityType') entityType?: EntityType,
    @Query('activityType') activityType?: ActivityType,
  ) {
    return this.activityLogsService.findAll({
      ...paginationDto,
      adminId,
      entityType,
      activityType,
    });
  }

  @Get('export')
  @RequirePermissions(AdminPermission.EXPORT_LOGS)
  @ApiOperation({ summary: 'Export activity logs as CSV' })
  @ApiResponse({
    status: 200,
    description: 'Activity logs exported successfully',
    content: {
      'text/csv': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiQuery({
    name: 'adminId',
    required: false,
    type: String,
    description: 'Filter logs by admin ID',
  })
  @ApiQuery({
    name: 'entityType',
    required: false,
    type: String,
    enum: EntityType,
    description: 'Filter logs by entity type',
  })
  @ApiQuery({
    name: 'activityType',
    required: false,
    type: String,
    enum: ActivityType,
    description: 'Filter logs by activity type',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Filter logs from this date (ISO format)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Filter logs until this date (ISO format)',
  })
  async exportLogs(
    @Res() res: Response,
    @Query('adminId') adminId?: string,
    @Query('entityType') entityType?: EntityType,
    @Query('activityType') activityType?: ActivityType,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const csvData = await this.activityLogsService.exportToCsv({
      adminId,
      entityType,
      activityType,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="activity-logs-${new Date().toISOString().split('T')[0]}.csv"`,
    );
    return res.send(csvData);
  }
}
