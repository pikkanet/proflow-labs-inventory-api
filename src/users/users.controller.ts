import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { EmailAndPasswordDto } from './dto/emailAndPassword.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('find')
  async getUserByEmailAndPassword(
    @Body() emailAndPasswordDto: EmailAndPasswordDto,
  ) {
    return await this.usersService.findUserByEmailAndPassword(
      emailAndPasswordDto.email,
      emailAndPasswordDto.password,
    );
  }
}
