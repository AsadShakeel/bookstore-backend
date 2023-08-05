import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async placeOrder(userId: string, orderData: CreateOrderDto) {
    // Retrieve the user from the database
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Calculate the total points required for the order
    const totalPoints = orderData.books.reduce((total, book) => total + book.point * book.quantity, 0);

    if (user.points < totalPoints) {
      throw new ConflictException('Insufficient user points');
    }

    // Start a transaction to ensure all operations are atomic
    const result = await this.prisma.$transaction(async (prisma) => {
      // Deduct the points from the user's account
      await prisma.user.update({ where: { id: userId }, data: { points: { decrement: totalPoints } } });

      // Create a new user order
      const userOrder = await prisma.userOrder.create({
        data: {
          user: { connect: { id: userId } },
          total_points: totalPoints,
          books: {
            createMany: {
              data: orderData.books.map((book) => ({
                book_id: book.bookId,
                book: { connect: { id: book.bookId } },
                quantity: book.quantity,
              })),
            },
          },
        },
        include: { books: true },
      });

      return userOrder;
    });

    return result;
  }

  async getOrderById(orderId: string) {
    return this.prisma.userOrder.findUnique({
      where: { id: orderId },
      include: { books: true },
    });
  }

  async cancelOrder(orderId: string) {
    // Retrieve the order from the database
    const order = await this.prisma.userOrder.findUnique({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Refund the points to the user
    await this.prisma.user.update({
      where: { id: order.user_id },
      data: { points: { increment: order.total_points } },
    });

    // Delete the order and associated book orders
    await this.prisma.userOrder.delete({ where: { id: orderId } });
  }

  findAllUserOrders(userId: string) {
    return `This action returns all order`;
  }

}
