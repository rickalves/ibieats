import { Test } from '@nestjs/testing';
import { CreateOrderHandler } from './create-order.handler';
import { CreateOrderCommand } from '../commands/create-order.command';
import { OrderRequestedEvent } from '@domain/events/order-requested.event';
import { EventPublisherService } from '@infrastructure/messaging/rabbitmq/event-publisher.service';
import { randomUUID } from 'crypto';

jest.mock('amqp-connection-manager', () => ({}));
jest.mock('@golevelup/nestjs-rabbitmq');
jest.mock('crypto', () => ({
  randomUUID: jest.fn(),
}));

describe('CreateOrderHandler', () => {
  let handler: CreateOrderHandler;
  let publishMock: jest.MockedFunction<
    (event: OrderRequestedEvent) => Promise<void>
  >;

  beforeEach(async () => {
    publishMock = jest.fn().mockResolvedValue(undefined);

    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateOrderHandler,
        {
          provide: EventPublisherService,
          useValue: {
            publish: publishMock,
          },
        },
      ],
    }).compile();

    handler = moduleRef.get<CreateOrderHandler>(CreateOrderHandler);

    (randomUUID as jest.Mock).mockClear();
  });

  describe('execute', () => {
    it('should create order and publish event for valid command', async () => {
      const mockOrderId = 'mock-uuid-123';
      (randomUUID as jest.Mock).mockReturnValue(mockOrderId);

      const command = new CreateOrderCommand(
        'user1',
        [
          { productId: 'p1', quantity: 2, price: 10.0 },
          { productId: 'p2', quantity: 1, price: 5.0 },
        ],
        'corr123',
      );

      await handler.execute(command);

      expect(randomUUID).toHaveBeenCalledTimes(1);
      expect(publishMock).toHaveBeenCalledTimes(1);
      const publishedEvent = publishMock.mock.calls[0][0];
      expect(publishedEvent).toBeInstanceOf(OrderRequestedEvent);
      expect(publishedEvent.orderId).toBe(mockOrderId);
      expect(publishedEvent.userId).toBe('user1');
      expect(publishedEvent.correlationId).toBe('corr123');
    });

    it('should throw error if order has more than 10 items', async () => {
      const items = Array.from({ length: 11 }, (_, i) => ({
        productId: `p${i}`,
        quantity: 1,
        price: 1.0,
      }));
      const command = new CreateOrderCommand('user1', items, 'corr123');

      await expect(handler.execute(command)).rejects.toThrow(
        'Order cannot have more than 10 items',
      );
    });
  });
});
