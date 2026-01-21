import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateOrderCommand } from '@application/commands/create-order.command';
import { CreateOrderRequestDto } from '@presentation/dtos/create-order.request.dto';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @Body() dto: CreateOrderRequestDto,
  ): Promise<{ message: string }> {
    const command = new CreateOrderCommand(
      dto.userId,
      dto.items,
      dto.correlationId,
    );
    await this.commandBus.execute(command);
    return { message: 'Order requested successfully' };
  }
}
