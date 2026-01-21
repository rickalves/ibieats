import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommand } from '../commands/create-order.command';
import { OrderRequest } from '@domain/entities/order-request.entity';
import { OrderValidationService } from '@domain/services/order-validation.service';
import { EventPublisherService } from '@infrastructure/messaging/rabbitmq/event-publisher.service';
import { OrderItem } from '@domain/value-objects/order-item.vo';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(private readonly eventPublisher: EventPublisherService) {}

  async execute(command: CreateOrderCommand): Promise<void> {
    const order = new OrderRequest(
      'generated-id',
      command.userId,
      command.items.map(
        (item) => new OrderItem(item.productId, item.quantity, item.price),
      ),
      command.items.reduce((sum, item) => sum + item.quantity * item.price, 0),
      command.correlationId,
    );

    OrderValidationService.validateOrder(order);

    await this.eventPublisher.publish(order.toOrderRequestedEvent());
  }
}
