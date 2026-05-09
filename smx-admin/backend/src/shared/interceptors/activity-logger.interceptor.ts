import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActivityLogsService } from '../../activity-logs/activity-logs.service';
import {
  ActivityType,
  EntityType,
} from '../../activity-logs/entities/activity-log.entity';
import { AdminUser } from '../../admin/entities/admin-user.entity';
import { Request } from 'express';

interface LogActivityMetadata {
  activityType: ActivityType;
  entityType: EntityType;
}

interface EntityWithId {
  id: string;
  [key: string]: unknown;
}

@Injectable()
export class ActivityLoggerInterceptor implements NestInterceptor {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const metadata = this.getMetadata(context);
    if (!metadata) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const admin = request.user as AdminUser;

    return next.handle().pipe(
      tap((data: EntityWithId) => {
        if (data?.id) {
          void this.activityLogsService.logActivity(
            admin,
            metadata.activityType,
            metadata.entityType,
            data.id,
            data,
            request,
          );
        }
      }),
    );
  }

  private getMetadata(context: ExecutionContext): LogActivityMetadata | null {
    const handler = context.getHandler();
    const activityType = Reflect.getMetadata(
      'activityType',
      handler,
    ) as ActivityType;
    const entityType = Reflect.getMetadata('entityType', handler) as EntityType;

    if (!activityType || !entityType) {
      return null;
    }

    return { activityType, entityType };
  }
}
