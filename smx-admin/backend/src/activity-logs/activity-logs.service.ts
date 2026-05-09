import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Request } from 'express';
import {
  ActivityLog,
  ActivityType,
  EntityType,
} from './entities/activity-log.entity';
import { AdminUser } from '../admin/entities/admin-user.entity';

interface FindAllParams {
  page?: number;
  limit?: number;
  adminId?: string;
  entityType?: EntityType;
  activityType?: ActivityType;
}

interface ExportParams {
  adminId?: string;
  entityType?: EntityType;
  activityType?: ActivityType;
  startDate?: Date;
  endDate?: Date;
}

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
  ) {}

  async logActivity(
    admin: AdminUser,
    activityType: ActivityType,
    entityType: EntityType,
    entityId: string,
    details?: Record<string, any>,
    req?: Request,
  ) {
    const log = this.activityLogRepository.create({
      admin,
      activityType,
      entityType,
      entityId,
      details,
      ipAddress: req?.ip,
      userAgent: req?.headers['user-agent'],
    });

    await this.activityLogRepository.save(log);
    return log;
  }

  async findAll(params: FindAllParams = {}) {
    const page = params.page ? parseInt(params.page.toString(), 10) : 1;
    const limit = params.limit ? parseInt(params.limit.toString(), 10) : 10;
    const { adminId, entityType, activityType } = params;

    // Ensure valid positive numbers
    const validPage = page > 0 ? page : 1;
    const validLimit = limit > 0 ? limit : 10;

    const skip = (validPage - 1) * validLimit;

    const [items, total] = await this.activityLogRepository.findAndCount({
      where: {
        ...(adminId && { admin: { id: adminId } }),
        ...(entityType && { entityType }),
        ...(activityType && { activityType }),
      },
      skip,
      take: validLimit,
      order: { createdAt: 'DESC' },
      relations: ['admin'],
    });

    const totalPages = Math.ceil(total / validLimit);

    return {
      items,
      total,
      page: validPage,
      limit: validLimit,
      totalPages,
    };
  }

  async findByAdmin(adminId: string) {
    return this.activityLogRepository.find({
      where: { admin: { id: adminId } },
      relations: ['admin'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByEntityType(entityType: EntityType) {
    return this.activityLogRepository.find({
      where: { entityType },
      relations: ['admin'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date) {
    return this.activityLogRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
      relations: ['admin'],
      order: { createdAt: 'DESC' },
    });
  }

  async exportToCsv(params: ExportParams): Promise<string> {
    const queryBuilder = this.activityLogRepository
      .createQueryBuilder('activityLog')
      .leftJoinAndSelect('activityLog.admin', 'admin')
      .orderBy('activityLog.createdAt', 'DESC');

    if (params.adminId) {
      queryBuilder.andWhere('admin.id = :adminId', { adminId: params.adminId });
    }

    if (params.entityType) {
      queryBuilder.andWhere('activityLog.entityType = :entityType', {
        entityType: params.entityType,
      });
    }

    if (params.activityType) {
      queryBuilder.andWhere('activityLog.activityType = :activityType', {
        activityType: params.activityType,
      });
    }

    if (params.startDate) {
      queryBuilder.andWhere('activityLog.createdAt >= :startDate', {
        startDate: params.startDate,
      });
    }

    if (params.endDate) {
      queryBuilder.andWhere('activityLog.createdAt <= :endDate', {
        endDate: params.endDate,
      });
    }

    const logs = await queryBuilder.getMany();

    // CSV header
    const headers = [
      'ID',
      'Admin Email',
      'Activity Type',
      'Entity Type',
      'Entity ID',
      'Details',
      'IP Address',
      'User Agent',
      'Created At',
    ].join(',');

    // CSV rows
    const rows = logs.map((log) =>
      [
        log.id,
        log.admin.email,
        log.activityType,
        log.entityType,
        log.entityId,
        JSON.stringify(log.details || {}),
        log.ipAddress,
        log.userAgent,
        log.createdAt.toISOString(),
      ]
        .map((field) => `"${field}"`)
        .join(','),
    );

    return [headers, ...rows].join('\n');
  }
}
