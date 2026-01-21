import { OrderRequest } from './order-request.entity';
import { OrderItem } from '../value-objects/order-item.vo';
import { OrderRequestedEvent } from '../events/order-requested.event';

describe('OrderRequest', () => {
  const validItem = new OrderItem('product1', 2, 10.0);
  const correlationId = 'corr123';

  describe('constructor', () => {
    it('should create an OrderRequest with valid data', () => {
      const order = new OrderRequest(
        'order1',
        'user1',
        [validItem],
        20.0,
        correlationId,
      );

      expect(order.id).toBe('order1');
      expect(order.userId).toBe('user1');
      expect(order.items).toEqual([validItem]);
      expect(order.total).toBe(20.0);
      expect(order.correlationId).toBe(correlationId);
    });
  });

  describe('validate', () => {
    it('should return true for valid order', () => {
      const order = new OrderRequest(
        'order1',
        'user1',
        [validItem],
        20.0,
        correlationId,
      );

      expect(order.validate()).toBe(true);
    });

    it('should return false if no items', () => {
      const order = new OrderRequest(
        'order1',
        'user1',
        [],
        20.0,
        correlationId,
      );

      expect(order.validate()).toBe(false);
    });

    it('should return false if total is zero or negative', () => {
      const orderZero = new OrderRequest(
        'order1',
        'user1',
        [validItem],
        0,
        correlationId,
      );
      const orderNegative = new OrderRequest(
        'order1',
        'user1',
        [validItem],
        -5.0,
        correlationId,
      );

      expect(orderZero.validate()).toBe(false);
      expect(orderNegative.validate()).toBe(false);
    });
  });

  describe('toOrderRequestedEvent', () => {
    it('should create OrderRequestedEvent correctly', () => {
      const order = new OrderRequest(
        'order1',
        'user1',
        [validItem],
        20.0,
        correlationId,
      );
      const event = order.toOrderRequestedEvent();

      expect(event).toBeInstanceOf(OrderRequestedEvent);
      expect(event.orderId).toBe('order1');
      expect(event.userId).toBe('user1');
      expect(event.items).toEqual([
        { productId: 'product1', quantity: 2, price: 10.0 },
      ]);
      expect(event.correlationId).toBe(correlationId);
    });
  });
});
