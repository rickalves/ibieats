import { AuthenticateUserCommand } from './authenticate-user.command';

describe('AuthenticateUserCommand', () => {
  describe('constructor', () => {
    it('should create an AuthenticateUserCommand with valid data', () => {
      const command = new AuthenticateUserCommand(
        'user@example.com',
        'password123',
      );

      expect(command.username).toBe('user@example.com');
      expect(command.password).toBe('password123');
    });
  });
});
