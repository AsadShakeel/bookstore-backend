import { Body, Controller, Post, UseGuards, Request, UseFilters } from "@nestjs/common";
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { HttpExceptionFilter } from "../filters/http-exception.filter";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoginDto } from "./dto/login.dto";

@Controller('auth')
@ApiTags('Auth')
@UseFilters(new HttpExceptionFilter())
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Signup a user' })
  async register(@Body() data: RegisterDto) {
    return await this.authService.register(data);
  }

  @Post(`/login`)
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Login a user' })
  async login(@Body() data: LoginDto, @Request() req) {
    return this.authService.login(data, req.user);
  }
}
