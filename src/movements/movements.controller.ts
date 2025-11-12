import { Body, Controller, Post, Req } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { CreateMovementDto } from './dto/createMovement.dto';

@Controller('item')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Post('movements')
  async createMovement(
    @Req() req: { user: { email: string } },
    @Body() createMovementDto: CreateMovementDto,
  ) {
    return await this.movementsService.createMovement(
      req.user.email,
      createMovementDto,
    );
  }
}
