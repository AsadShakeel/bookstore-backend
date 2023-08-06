import { Body, Controller, Delete, Get, Param, Post, UseFilters } from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { HttpExceptionFilter } from "../filters/http-exception.filter";

@Controller('order')
@ApiTags('Order')
@UseFilters(new HttpExceptionFilter())
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Place an order' })
  create(@Body() createOrderDto: CreateOrderDto) {
    // get userId from auth token
    let userId = createOrderDto.userId; // meanwhile
    console.log(createOrderDto);
    return this.orderService.placeOrder(userId, createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all the orders of the current logged in user' })
  findAll() {
    // get userId from auth token
    let userId = 'clkz72f8e00001y9c4ymirkhb'; // meanwhile
    return this.orderService.findAllUserOrders(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by id' })
  findOne(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel the order' })
  remove(@Param('id') id: string) {
    return this.orderService.cancelOrder(id);
  }
}
