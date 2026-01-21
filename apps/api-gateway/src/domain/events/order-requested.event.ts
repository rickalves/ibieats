export type OrderItemEvent = {
  productId: string;
  quantity: number;
  price: number;
};

export class OrderRequestedEvent {
  constructor(
    public readonly orderId: string,
    public readonly userId: string,
    public readonly items: OrderItemEvent[],
    public readonly correlationId: string,
  ) {}
}
