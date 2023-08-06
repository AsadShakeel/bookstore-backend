import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateBookDto } from './create-book.dto';
import { IsArray, IsNumber, IsString } from "class-validator";

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @ApiProperty()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsString()
  writer?: string;

  @ApiProperty()
  @IsString()
  coverImage?: string;

  @ApiProperty()
  @IsNumber()
  point?: number;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
