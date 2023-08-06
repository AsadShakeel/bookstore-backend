import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtTokenService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private async validateRequest(request: any) {
    const payload = this.jwtTokenService.decode(request['token']);

    if (payload && payload['email']) {
      const user = await this.prisma.user.findFirst({
        where: {
          email: payload['email'],
        },
      });
      return !!user;
    } else {
      throw new UnauthorizedException('User does not have permissions');
    }
  }
}
