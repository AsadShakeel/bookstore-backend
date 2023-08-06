import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  writer: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  coverImage: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  point: number;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
