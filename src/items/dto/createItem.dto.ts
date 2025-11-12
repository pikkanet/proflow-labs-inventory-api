/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsInt()
  @IsNotEmpty()
  warehouse_id: number;
}
