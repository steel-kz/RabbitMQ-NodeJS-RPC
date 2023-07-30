import { Channel, ConsumeMessage } from "amqplib";
import MessageHandler from "../messageHandler";
const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: 'application.log' })],
});

export default class Consumer {
  constructor(private channel: Channel, private rpcQueue: string) {}

  async consumeMessages() {
    logger.info("Ready to consume messages...");

    this.channel.consume(
      this.rpcQueue,
      async (message: ConsumeMessage) => {
        const { correlationId, replyTo } = message.properties;
        const operation = message.properties.headers.function;
        if (!correlationId || !replyTo) {
          logger.info("Missing some properties...");
        }
        logger.info("Consumed", JSON.parse(message.content.toString()));
        await MessageHandler.handle(
          operation,
          JSON.parse(message.content.toString()),
          correlationId,
          replyTo
        );
      },
      {
        noAck: true,
      }
    );
  }
}
