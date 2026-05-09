import { SetMetadata } from '@nestjs/common';
import {
  ActivityType,
  EntityType,
} from '../../activity-logs/entities/activity-log.entity';

export function LogActivity(
  activityType: ActivityType,
  entityType: EntityType,
) {
  return (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    SetMetadata('activityType', activityType)(target, propertyKey, descriptor);
    SetMetadata('entityType', entityType)(target, propertyKey, descriptor);
    return descriptor;
  };
}
