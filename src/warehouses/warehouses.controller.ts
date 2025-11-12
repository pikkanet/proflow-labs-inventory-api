import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { WarehousesService } from './warehouses.service';

@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Get('/')
  async findAllWarehouses() {
    try {
      return await this.warehousesService.findAllWarehouses();
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

  @Post('/')
  async createWarehouse(@Body() createWarehouseDto: { name: string }) {
    try {
      return await this.warehousesService.createWarehouse(
        createWarehouseDto.name,
      );
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
