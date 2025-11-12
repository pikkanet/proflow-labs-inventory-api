/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ActivityType } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMovementDto {
  @IsEnum(ActivityType)
  @IsNotEmpty()
  activityType: ActivityType;

  @IsInt()
  @IsNotEmpty()
  qty: number;

  @IsString()
  @IsOptional()
  note: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsInt()
  @IsNotEmpty()
  warehouseId: number;
}
