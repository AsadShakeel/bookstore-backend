import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {
  }

  async placeOrder(userId: string, orderData: CreateOrderDto) {
    // Retrieve the user from the database
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // get points of the book
    const bookPoints = await this.prisma.book.findMany({
      where: {
        id: {
          in: orderData.books.map((book) => book.bookId)
        }
      },
      select: { id: true, point: true }
    });
    const books = orderData.books.map((book) => {
      const bookPoint = bookPoints.find((bookPoint) => bookPoint.id === book.bookId);
      if (!bookPoint) {
        throw new NotFoundException(`Book with id ${book.bookId} doesn't have points`);
      }
      return { ...book, point: bookPoint.point };
    });
    // Calculate the total points required for the order
    const totalPoints = books.reduce((total, book) => total + book.point * book.quantity, 0);

    if (user.points < totalPoints) {
      throw new ConflictException("Insufficient user points");
    }

    try {

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
              create: orderData.books.map((book) => ({
                book_id: book.bookId,
                // book: { connect: { id: book.bookId } },
                quantity: book.quantity
              }))
            }
          },
          include: { books: true }
        });

        return userOrder;
      });

      return result;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getOrderById(orderId: string) {
    return this.prisma.userOrder.findUnique({
      where: { id: orderId },
      include: { books: true }
    });
  }

  async cancelOrder(orderId: string) {
    // Retrieve the order from the database
    const order = await this.prisma.userOrder.findUnique({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    await this.prisma.$transaction(async (prisma) => {
      // Refund the points to the user
      await this.prisma.user.update({
        where: { id: order.user_id },
        data: { points: { increment: order.total_points } }
      });

      // Delete the order and associated book orders
      await this.prisma.userOrder.delete({
        where: { id: orderId },
      });
    });

  }

  async findAllUserOrders(userId: string) {
    return await this.prisma.userOrder.findMany({
      where: { user_id: userId },
      include: {
        books: true
      }
    });
  }

}
