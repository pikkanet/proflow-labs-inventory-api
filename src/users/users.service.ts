import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUsername(username: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { username },
      });
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

  async findUserByUsernameAndPassword(username: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        throw new HttpException(
          'User not found with the provided credentials',
          HttpStatus.NOT_FOUND,
        );
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash,
      );

      if (!isPasswordValid) {
        throw new HttpException(
          'User not found with the provided credentials',
          HttpStatus.NOT_FOUND,
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...userWithoutPassword } = user;

      return {
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
