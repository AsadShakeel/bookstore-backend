import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  IsEnum,
} from 'class-validator';

export enum Role {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
  ROOT = 'ROOT',
}

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
