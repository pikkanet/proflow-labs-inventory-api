import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsernameAndPasswordDto } from './dto/usernameAndPassword.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('find')
  async getUserByUsernameAndPassword(
    @Body() usernameAndPasswordDto: UsernameAndPasswordDto,
  ) {
    return await this.usersService.findUserByUsernameAndPassword(
      usernameAndPasswordDto.username,
      usernameAndPasswordDto.password,
    );
  }
}
