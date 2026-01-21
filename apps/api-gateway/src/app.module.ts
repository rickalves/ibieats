import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { OrdersController } from '@presentation/controllers/orders.controller';
import { AuthController } from '@presentation/controllers/auth.controller';
import { CreateOrderHandler } from '@application/handlers/create-order.handler';
import { EventPublisherService } from '@infrastructure/messaging/rabbitmq/event-publisher.service';
import { JwtStrategy } from '@infrastructure/auth/jwt.strategy';
import { RABBITMQ_EXCHANGE } from '@shared/constants/rabbitmq.constants';

@Module({
  imports: [
    CqrsModule,
    PassportModule,
    JwtModule.register({ secret: process.env.JWT_SECRET || 'fallback-secret' }),
    RabbitMQModule.forRoot({
      exchanges: [{ name: RABBITMQ_EXCHANGE, type: 'topic' }],
      uri: process.env.RABBITMQ_URI || 'amqp://localhost:5672/',
    }),
  ],
  controllers: [OrdersController, AuthController],
  providers: [CreateOrderHandler, EventPublisherService, JwtStrategy],
})
export class AppModule {}
