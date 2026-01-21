export class CreateOrderCommand {
  constructor(
    public readonly userId: string,
    public readonly items: {
      productId: string;
      quantity: number;
      price: number;
    }[],
    public readonly correlationId: string,
  ) {}
}
