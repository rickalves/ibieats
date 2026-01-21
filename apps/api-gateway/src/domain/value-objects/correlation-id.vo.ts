export class CorrelationId {
  constructor(public readonly value: string) {
    if (!value) throw new Error('CorrelationId cannot be empty');
  }
}
