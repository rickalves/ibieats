import { CreateOrderCommand } from './create-order.command';

describe('CreateOrderCommand', () => {
  describe('constructor', () => {
    it('should create a CreateOrderCommand with valid data', () => {
      const items = [{ productId: 'p1', quantity: 2, price: 10.0 }];
      const command = new CreateOrderCommand('user1', items, 'corr123');

      expect(command.userId).toBe('user1');
      expect(command.items).toEqual(items);
      expect(command.correlationId).toBe('corr123');
    });
  });
});
