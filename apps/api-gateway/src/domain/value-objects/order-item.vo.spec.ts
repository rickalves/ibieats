import { OrderItem } from './order-item.vo';

describe('OrderItem', () => {
  describe('constructor', () => {
    it('should create an OrderItem with valid data', () => {
      const item = new OrderItem('product1', 2, 10.0);

      expect(item).toBeInstanceOf(OrderItem);
      expect(item.productId).toBe('product1');
      expect(item.quantity).toBe(2);
      expect(item.price).toBe(10.0);
    });

    it('should throw error for quantity <= 0', () => {
      expect(() => new OrderItem('product1', 0, 10.0)).toThrow(
        'Quantity must be positive',
      );
      expect(() => new OrderItem('product1', -1, 10.0)).toThrow(
        'Quantity must be positive',
      );
    });

    it('should throw error for negative price', () => {
      expect(() => new OrderItem('product1', 2, -5.0)).toThrow(
        'Price cannot be negative',
      );
    });

    it('should allow price zero', () => {
      const item = new OrderItem('product1', 2, 0);

      expect(item.price).toBe(0);
    });
  });

  describe('total', () => {
    it('should calculate total correctly', () => {
      const item = new OrderItem('product1', 3, 15.5);

      expect(item.total).toBe(46.5);
    });
  });
});
