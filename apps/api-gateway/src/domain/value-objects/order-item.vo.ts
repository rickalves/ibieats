export class OrderItem {
  constructor(
    public readonly productId: string,
    public readonly quantity: number,
    public readonly price: number,
  ) {
    if (quantity <= 0) throw new Error('Quantity must be positive');
    if (price < 0) throw new Error('Price cannot be negative');
  }

  public get total(): number {
    return this.quantity * this.price;
  }
}
