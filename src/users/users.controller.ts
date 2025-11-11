import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
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
    try {
      const user = await this.usersService.findUserByEmailAndPassword(
        getUserDto.email,
        getUserDto.password,
      );

      if (!user) {
        throw new HttpException(
          'User not found with the provided credentials',
          HttpStatus.NOT_FOUND,
        );
      }

      // Remove password_hash from response
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...userWithoutPassword } = user;

      return {
        success: true,
        data: userWithoutPassword,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'An error occurred while fetching user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
