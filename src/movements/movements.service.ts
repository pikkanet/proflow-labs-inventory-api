import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateMovementDto } from './dto/createMovement.dto';
import { ActivityType, StockStatus } from '@prisma/client';

@Injectable()
export class MovementsService {
  constructor(private readonly prisma: PrismaService) {}

  async createMovement(email: string, movement: CreateMovementDto) {
    try {
      const findItems = await this.prisma.item.findFirst({
        where: {
          sku: movement.sku,
        },
      });
      if (!findItems) {
        throw new Error('Item not found');
      }
      const currentQty = findItems.qty;

      // Create movement record
      await this.prisma.inventoryMovement.create({
        data: {
          activity_type: movement.activityType,
          qty: movement.qty,
          current_qty: currentQty,
          sku: movement.sku,
          warehouse_id: movement.warehouseId,
          note: movement.note,
        },
      });

      // Update item qty, stock status and updated_by

      let stockQty = 0;
      if (movement.activityType === ActivityType.inbound) {
        stockQty = currentQty + movement.qty;
      } else {
        stockQty = currentQty - movement.qty;
      }
      let stockStatus: StockStatus = StockStatus.out_of_stock;
      if (stockQty > 0 && stockQty <= 10) {
        stockStatus = StockStatus.low_stock;
      } else if (stockQty > 10) {
        stockStatus = StockStatus.in_stock;
      }

      await this.prisma.item.update({
        where: {
          sku: movement.sku,
        },
        data: {
          qty: stockQty,
          stock_status: stockStatus,
          updated_by: email,
        },
      });
      return {
        message: 'Movement created successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'An error occurred while creating movement',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
