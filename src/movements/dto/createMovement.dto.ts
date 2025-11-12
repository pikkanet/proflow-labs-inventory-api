import { ActivityType } from '@prisma/client';

export class CreateMovementDto {
  activityType: ActivityType;
  qty: number;
  note: string;
  sku: string;
  warehouseId: number;
}
