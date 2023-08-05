import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  writer: string;

  @IsNotEmpty()
  @IsString()
  coverImage: string;

  @IsNotEmpty()
  @IsNumber()
  point: number;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
