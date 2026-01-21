import { OrderRequest } from '../entities/order-request.entity';

export class OrderValidationService {
  public static validateOrder(order: OrderRequest): void {
    if (order.items.length > 10) {
      throw new Error('Order cannot have more than 10 items');
    }
  }
}
