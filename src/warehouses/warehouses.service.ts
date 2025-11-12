import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Warehouse } from '@prisma/client';

@Injectable()
export class WarehousesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllWarehouses() {
    const result: Warehouse[] = await this.prisma.warehouse.findMany();
    return {
      data: result,
    };
  }

  async createWarehouse(name: string) {
    const result: Warehouse = await this.prisma.warehouse.create({
      data: {
        name,
      },
    });
    return {
      data: result,
    };
  }
}
