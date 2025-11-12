import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async findAllItems(
    @Query('name') name: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('warehouseIds') warehouseIds: string,
  ) {
    const pageQuery = page ? Number(page) : 1;
    const pageSizeQuery = pageSize ? Number(pageSize) : 20;
    const warehouseIdsQuery = warehouseIds
      ? warehouseIds.split(',').map(Number)
      : [];
    try {
      return await this.itemsService.findAllItems(
        name,
        pageQuery,
        pageSizeQuery,
        warehouseIdsQuery,
      );
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
}
