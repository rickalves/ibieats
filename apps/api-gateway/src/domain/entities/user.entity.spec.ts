import { User } from './user.entity';

describe('User', () => {
  describe('constructor', () => {
    it('should create a User with valid data', () => {
      const user = new User('user1', 'user@example.com');

      expect(user.id).toBe('user1');
      expect(user.email).toBe('user@example.com');
    });
  });
});
