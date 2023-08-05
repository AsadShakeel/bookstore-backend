import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class OrderBookDto {
  @IsNotEmpty()
  bookId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  point: number;
}

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderBookDto)
  books: OrderBookDto[];
}
