import { Body, Controller, Delete, Get, Param, Post, UseFilters } from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { ApiTags } from "@nestjs/swagger";
import { HttpExceptionFilter } from "../filters/http-exception.filter";

@Controller('order')
@ApiTags('order')
@UseFilters(new HttpExceptionFilter())
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    // get userId from auth token
    let userId = '1'; // meanwhile
    return this.orderService.placeOrder(userId, createOrderDto);
  }

  @Get()
  findAll() {
    // get userId from auth token
    let userId = '1'; // meanwhile
    return this.orderService.findAllUserOrders(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.cancelOrder(id);
  }
}
