import { Body, Controller, Post, UseGuards, Request, UseFilters } from "@nestjs/common";
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { HttpExceptionFilter } from "../filters/http-exception.filter";
import { ApiTags } from "@nestjs/swagger";

@Controller('auth')
@ApiTags('auth')
@UseFilters(new HttpExceptionFilter())
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() data: RegisterDto) {
    return await this.authService.register(data);
  }

  @Post(`/login`)
  @UseGuards(AuthGuard('local'))
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
