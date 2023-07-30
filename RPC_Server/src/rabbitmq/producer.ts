import { Channel } from "amqplib";
const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: 'application.log' })],
});

export default class Producer {
  constructor(private channel: Channel) {}

  async produceMessages(
    data: any,
    correlationId: string,
    replyToQueue: string
  ) {
    logger.info("Responding with..", data);
    this.channel.sendToQueue(replyToQueue, Buffer.from(JSON.stringify(data)), {
      correlationId: correlationId,
    });
  }
}
