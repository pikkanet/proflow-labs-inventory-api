import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Item } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateItemDto } from './dto/createItem.dto';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllItems(
    name: string,
    page: number,
    pageSize: number,
    warehouseIdsQuery: number[],
  ) {
    try {
      const whereClause: {
        name?: { contains: string; mode: 'insensitive' };
        warehouse_id?: { in: number[] };
      } = {};

      if (name?.trim()) {
        whereClause.name = {
          contains: name,
          mode: 'insensitive',
        };
      }
      if (warehouseIdsQuery && warehouseIdsQuery.length > 0) {
        whereClause.warehouse_id = {
          in: warehouseIdsQuery,
        };
      }

      const result: Item[] = await this.prisma.item.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: whereClause,
        orderBy: {
          updated_at: 'desc',
        },
      });

      const warehouses = await this.prisma.warehouse.findMany();

      const mappedWarehouses = result.map((item) => {
        const warehouse = warehouses.find(
          (warehouse) => warehouse.id === item.warehouse_id,
        );
        return {
          ...item,
          warehouse: warehouse?.name || '-',
        };
      });

      const totalItems = await this.prisma.item.count({
        where: whereClause,
      });

      return {
        totalItems: totalItems,
        page,
        pageSize,
        totalPages: Math.ceil(totalItems / pageSize),
        data: mappedWarehouses,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'An error occurred while fetching items',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createItem(email: string, createItemDto: CreateItemDto) {
    try {
      const existingItem = await this.prisma.item.findFirst({
        where: {
          name: createItemDto.name,
          warehouse_id: createItemDto.warehouse_id,
        },
      });

      if (existingItem) {
        throw new HttpException(
          'An item with this name already exists in this warehouse',
          HttpStatus.CONFLICT,
        );
      }

      await this.prisma.item.create({
        data: {
          name: createItemDto.name,
          warehouse_id: createItemDto.warehouse_id,
          image: createItemDto.image,
          updated_by: email,
        },
      });
      return {
        message: 'Item created successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'An error occurred while creating item',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async editItemName(sku: string, name: string, updatedBy: string) {
    if (!name?.trim()) {
      throw new HttpException('Name is required', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.prisma.item.update({
        where: { sku },
        data: {
          name: name.trim(),
          updated_by: updatedBy,
        },
      });
      return {
        message: 'Item edited successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'An error occurred while editing item',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
