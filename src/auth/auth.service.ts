/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersDto } from 'src/users/dto/users.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async signIn(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new HttpException(
        'An error occurred during authentication',
        HttpStatus.NOT_FOUND,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new HttpException(
        'An error occurred during authentication',
        HttpStatus.NOT_FOUND,
      );
    }

    const payload: UsersDto = {
      id: user.id,
      username: user.username,
      name: user.name || '',
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getProfile(id: string): Promise<{ data: UsersDto }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new HttpException(
        'An error occurred while fetching profile',
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      data: {
        id: user.id,
        username: user.username,
        name: user.name || '',
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    };
  }
}
