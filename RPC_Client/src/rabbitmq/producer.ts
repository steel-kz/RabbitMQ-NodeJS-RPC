import { Channel } from "amqplib";
import config from "../config";
import { randomUUID } from "crypto";
import EventEmitter from "events";
const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: 'application.log' })],
});

export default class Producer {
  constructor(
    private channel: Channel,
    private replyQueueName: string,
    private eventEmitter: EventEmitter
  ) {}

  async produceMessages(data: any) {
    const uuid = randomUUID();
    logger.info("the corr id is ", uuid);
    this.channel.sendToQueue(
      config.rabbitMQ.queues.rpcQueue,
      Buffer.from(JSON.stringify(data)),
      {
        replyTo: this.replyQueueName,
        correlationId: uuid,
        expiration: 10,
        headers: {
          function: data.operation,
        },
      }
    );

    return new Promise((resolve, reject) => {
      this.eventEmitter.once(uuid, async (data) => {
        const reply = JSON.parse(data.content.toString());
        resolve(reply);
      });
    });
  }
}
