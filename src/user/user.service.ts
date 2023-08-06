import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany();
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(userId: string, userData: UpdateUserDto) {
    // Check if the user exists
    const existingUser = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Update the user information
    return this.prisma.user.update({ where: { id: userId }, data: userData });
  }

  async deleteUser(userId: string) {
    // Check if the user exists
    const existingUser = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Delete the user
    return this.prisma.user.delete({ where: { id: userId } });
  }

}
