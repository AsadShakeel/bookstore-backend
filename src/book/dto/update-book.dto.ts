import { PartialType } from '@nestjs/swagger';
import { CreateBookDto } from './create-book.dto';
import { IsArray, IsNumber, IsString } from "class-validator";

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @IsString()
  title?: string;

  @IsString()
  writer?: string;

  @IsString()
  coverImage?: string;

  @IsNumber()
  point?: number;

  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
