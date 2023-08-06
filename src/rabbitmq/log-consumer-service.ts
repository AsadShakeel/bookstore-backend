import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import * as fs from 'fs';
import * as path from 'path';
import * as winston from 'winston';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';

@Injectable()
export class LogConsumerService {
  private readonly queueName = process.env.QUEUE_NAME;
  private channel: amqp.Channel;

  constructor() {
    this.connect();
    this.setupLogger();
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
      await this.channel.consume(this.queueName, this.handleMessage.bind(this));
    } catch (e) {
      console.error('error in consumer', e);
    }
  }

  setupLogger() {
    winston.configure({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.File({
          filename: path.join(__dirname, `../logs/daily.log`),
          maxsize: 1048576, // 1MB
          maxFiles: 10,
        }),
      ],
    });
  }

  async handleMessage(message: amqp.Message | null) {
    if (!message) return;
    const logData = JSON.parse(message.content.toString());
    winston.info(logData);
    this.channel.ack(message);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  rotateLogFile() {
    const currentDate = moment().format('YYYY-MM-DD');
    const logFilePath = path.join(__dirname, `../logs/daily.log`);
    const rotatedLogFilePath = path.join(
      __dirname,
      `../logs/${currentDate}.log`,
    );

    fs.renameSync(logFilePath, rotatedLogFilePath);
    this.setupLogger();
  }
}
