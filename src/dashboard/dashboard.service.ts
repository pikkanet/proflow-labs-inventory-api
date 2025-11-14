import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const result = await this.prisma.$queryRaw<
      Array<{
        total_items: bigint;
        total_quantity: bigint;
        low_stock: bigint;
        out_of_stock: bigint;
      }>
    >`
      SELECT 
        COUNT(*)::bigint as total_items,
        COALESCE(SUM(qty), 0)::bigint as total_quantity,
        COUNT(*) FILTER (WHERE stock_status = 'low_stock')::bigint as low_stock,
        COUNT(*) FILTER (WHERE stock_status = 'out_of_stock')::bigint as out_of_stock
      FROM "Item"
    `;

    const totalItems = result[0] ? Number(result[0].total_items) : 0;
    const totalQuantity = result[0] ? Number(result[0].total_quantity) : 0;
    const lowStock = result[0] ? Number(result[0].low_stock) : 0;
    const outOfStock = result[0] ? Number(result[0].out_of_stock) : 0;

    return {
      data: {
        totalItems,
        totalQuantity,
        lowStock,
        outOfStock,
        lastUpdated: new Date(),
      },
    };
  }
}
