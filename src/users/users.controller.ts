import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

export class GetUserDto {
  email: string;
  password: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('find')
  async getUserByEmailAndPassword(@Body() getUserDto: GetUserDto) {
    return await this.usersService.findUserByEmailAndPassword(
      getUserDto.email,
      getUserDto.password,
    );
  }
}
