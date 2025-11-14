/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString } from 'class-validator';

export class UsernameAndPasswordDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
