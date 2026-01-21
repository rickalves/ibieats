import { OrderRequestedEvent } from './order-requested.event';

describe('OrderRequestedEvent', () => {
  describe('constructor', () => {
    it('should create an OrderRequestedEvent with valid data', () => {
      const items = [{ productId: 'p1', quantity: 2, price: 10.0 }];
      const event = new OrderRequestedEvent(
        'order1',
        'user1',
        items,
        'corr123',
      );

      expect(event.orderId).toBe('order1');
      expect(event.userId).toBe('user1');
      expect(event.items).toEqual(items);
      expect(event.correlationId).toBe('corr123');
    });
  });
});
