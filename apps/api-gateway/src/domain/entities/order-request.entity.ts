import { OrderRequestedEvent } from '../events/order-requested.event';
import { OrderItem } from '../value-objects/order-item.vo';

export class OrderRequest {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly items: OrderItem[],
    public readonly total: number,
    public readonly correlationId: string,
  ) {}

  public validate(): boolean {
    return this.items.length > 0 && this.total > 0;
  }

  public toOrderRequestedEvent(): OrderRequestedEvent {
    return new OrderRequestedEvent(
      this.id,
      this.userId,
      this.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      this.correlationId,
    );
  }
}
