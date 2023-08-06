import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  use(req: Request, res: Response, next: () => void) {
    // Capture request and response data
    const requestLog = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
    };

    const originalSend = res.send;
    res.send = (data: any): any => {
      const responseLog = {
        status: res.statusCode,
        body: data,
      };

      // Log the request and response data
      this.rabbitMQService.publishLog({
        request: requestLog,
        response: responseLog,
      });

      originalSend.call(res, data);
    };

    next();
  }
}
