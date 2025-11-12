import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Warehouse } from '@prisma/client';

@Injectable()
export class WarehousesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllWarehouses() {
    try {
      const result: Warehouse[] = await this.prisma.warehouse.findMany();
      return {
        data: result,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'An error occurred while fetching warehouses',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createWarehouse(name: string) {
    try {
      await this.prisma.warehouse.create({
        data: {
          name,
        },
      });
      return {
        message: 'Warehouse created successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'An error occurred while creating warehouse',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
