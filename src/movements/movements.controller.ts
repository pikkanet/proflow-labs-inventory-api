import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { CreateMovementDto } from './dto/createMovement.dto';

@Controller('item')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Post('movements')
  async createMovement(
    @Req() req: { user: { username: string } },
    @Body() createMovementDto: CreateMovementDto,
  ) {
    return await this.movementsService.createMovement(
      req.user.username,
      createMovementDto,
    );
  }

  @Get(':sku/movements')
  async findAllMovementsBySku(@Param('sku') sku: string) {
    return await this.movementsService.findAllMovementsBySku(sku);
  }
}
