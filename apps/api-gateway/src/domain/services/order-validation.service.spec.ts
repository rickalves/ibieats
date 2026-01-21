import { OrderValidationService } from './order-validation.service';
import { OrderRequest } from '../entities/order-request.entity';
import { OrderItem } from '../value-objects/order-item.vo';

describe('OrderValidationService', () => {
  const validItem = new OrderItem('product1', 1, 10.0);

  describe('validateOrder', () => {
    it('should not throw for order with <= 10 items', () => {
      const items = Array.from({ length: 10 }, () => validItem);
      const order = new OrderRequest(
        'order1',
        'user1',
        items,
        100.0,
        'corr123',
      );

      expect(() => OrderValidationService.validateOrder(order)).not.toThrow();
    });

    it('should throw error for order with more than 10 items', () => {
      const items = Array.from({ length: 11 }, () => validItem);
      const order = new OrderRequest(
        'order1',
        'user1',
        items,
        110.0,
        'corr123',
      );

      expect(() => OrderValidationService.validateOrder(order)).toThrow(
        'Order cannot have more than 10 items',
      );
    });
  });
});
