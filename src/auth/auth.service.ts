import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare, hash } from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly jwtTokenService: JwtService
  ) {
  }

  async register(data: RegisterDto) {
    const checkUserExists = await this.prisma.user.findFirst({
      where: {
        email: data.email
      }
    });
    if (checkUserExists) {
      throw new HttpException("User already registered", HttpStatus.FOUND);
    }
    data.password = await hash(data.password, 12);
    const createUser = await this.prisma.user.create({
      data: { ...data, points: 100 }
    });
    if (createUser) {
      return {
        statusCode: 200,
        message: "Register Successfull"
      };
    }
  }

  async validateUser(email, password) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: email
      }
    });

    if (user) {
      const checkPassword = await compare(password, user.password);

      if (checkPassword) {
        return user;
      }
    }

    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      name: user.name,
      role: user.role,
      sub: user._id
    };

    return {
      access_token: this.jwtTokenService.sign(payload)
    };
  }
}
