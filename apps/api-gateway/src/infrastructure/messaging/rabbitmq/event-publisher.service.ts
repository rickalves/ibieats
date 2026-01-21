import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  RABBITMQ_EXCHANGE,
  ORDER_REQUESTED_ROUTING_KEY,
} from '@shared/constants/rabbitmq.constants';

@Injectable()
export class EventPublisherService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publish(event: unknown): Promise<void> {
    await this.amqpConnection.publish(
      RABBITMQ_EXCHANGE,
      ORDER_REQUESTED_ROUTING_KEY,
      event,
    );
  }
}
