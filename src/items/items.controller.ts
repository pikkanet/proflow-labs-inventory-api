import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { UsersDto } from 'src/users/dto/users.dto';
import { CreateItemDto } from './dto/createItem.dto';

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

    return await this.itemsService.findAllItems(
      name,
      pageQuery,
      pageSizeQuery,
      warehouseIdsQuery,
    );
  }

  @Post()
  async createItem(
    @Req() req: { user: UsersDto },
    @Body() createItemDto: CreateItemDto,
  ) {
    return await this.itemsService.createItem(req.user.username, createItemDto);
  }

  @Patch(':sku')
  async editItemName(
    @Param('sku') sku: string,
    @Body() editItemNameDto: { name: string },
    @Req() req: { user: UsersDto },
  ) {
    return await this.itemsService.editItemName(
      sku,
      editItemNameDto.name,
      req.user.username,
    );
  }
}
