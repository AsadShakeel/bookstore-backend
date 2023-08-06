// rabbitmq.service.ts

import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  private readonly queueName = process.env.QUEUE_NAME;
  private channel: amqp.Channel;

  constructor() {
    this.connect();
  }

  async connect() {
    try {
      const connection = await amqp.connect({
        hostname: process.env.RABBITMQ_HOST,
        port: +process.env.RABBITMQ_PORT,
        username: process.env.RABBITMQ_DEFAULT_USER,
        password: process.env.RABBITMQ_DEFAULT_PASS,
      });

      this.channel = await connection.createChannel();
      await this.channel.assertQueue(this.queueName, { durable: false });
    } catch (e) {
      console.error('error in producer', e);
    }
  }

  async publishLog(logData: any) {
    this.channel.sendToQueue(
      this.queueName,
      Buffer.from(JSON.stringify(logData)),
    );
  }
}
