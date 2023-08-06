import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { LoggingMiddleware } from './middlewares/logging.middleware';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';
import { LogConsumerService } from './rabbitmq/log-consumer-service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    BookModule,
    AuthModule,
    PrismaModule,
    OrderModule,
    UserModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, RabbitMQService, LogConsumerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
