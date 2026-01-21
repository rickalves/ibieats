import { Controller, Post, Body } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CommandBus } from '@nestjs/cqrs';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  login(@Body() body: { username: string; password: string }) {
    if (body.username === 'admin' && body.password === 'password') {
      const payload = { sub: 'user-123', username: body.username };
      const token = this.jwtService.sign(payload);
      return { access_token: token };
    }
    throw new Error('Invalid credentials');
  }
}
