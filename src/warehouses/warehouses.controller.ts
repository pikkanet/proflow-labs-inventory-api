import { Body, Controller, Get, Post } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';

@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Get('/')
  async findAllWarehouses() {
    return await this.warehousesService.findAllWarehouses();
  }

  @Post('/')
  async createWarehouse(@Body() createWarehouseDto: { name: string }) {
    return await this.warehousesService.createWarehouse(
      createWarehouseDto.name,
    );
  }
}
