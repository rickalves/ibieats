import { CorrelationId } from './correlation-id.vo';

describe('CorrelationId', () => {
  describe('constructor', () => {
    it('should create a CorrelationId with valid value', () => {
      const corrId = new CorrelationId('valid-id');

      expect(corrId.value).toBe('valid-id');
    });

    it('should throw error for empty value', () => {
      expect(() => new CorrelationId('')).toThrow(
        'CorrelationId cannot be empty',
      );
    });

    it('should throw error for null or undefined', () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      expect(() => new CorrelationId(null as any)).toThrow(
        'CorrelationId cannot be empty',
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      expect(() => new CorrelationId(undefined as any)).toThrow(
        'CorrelationId cannot be empty',
      );
    });
  });
});
