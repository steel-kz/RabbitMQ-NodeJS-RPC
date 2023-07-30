import { Channel, ConsumeMessage } from "amqplib";
import EventEmitter from "events";
const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: 'application.log' })],
});

export default class Consumer {
  constructor(
    private channel: Channel,
    private replyQueueName: string,
    private eventEmitter: EventEmitter
  ) {}

  async consumeMessages() {
    logger.info("Ready to consume messages...");

    this.channel.consume(
      this.replyQueueName,
      (message: ConsumeMessage) => {
        logger.info("the reply is..", JSON.parse(message.content.toString()));
        this.eventEmitter.emit(
          message.properties.correlationId.toString(),
          message
        );
      },
      {
        noAck: true,
      }
    );
  }
}
