import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Query,
  Req,
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

  @Patch(':sku')
  async editItemName(
    @Param('sku') sku: string,
    @Body() editItemNameDto: { name: string },
    @Req() req: { user: { email: string } },
  ) {
    const email = req.user.email;
    return await this.itemsService.editItemName(
      sku,
      editItemNameDto.name,
      email,
    );
  }
}
