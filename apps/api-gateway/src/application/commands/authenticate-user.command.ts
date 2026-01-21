export class AuthenticateUserCommand {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) {}
}
