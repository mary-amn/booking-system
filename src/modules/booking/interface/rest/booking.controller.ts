// src/modules/scheduling/interfaces/rest/booking.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateBookingCommand } from '../../application/commands/create-booking.command';
import { ConfirmBookingCommand } from '../../application/commands/confirm-booking.command';
import { CancelBookingCommand } from '../../application/commands/cancel-booking.command';
import { GetBookingQuery } from '../../application/queries/get-booking.query';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from '../../domain/entities/booking.entity';
import { Resource } from '../../../resource/domain/entities/resource.entity';
import { ListAvailabilityQuery } from '../../application/queries/list-availability.query';

@Controller('bookings')
export class BookingController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() dto: CreateBookingDto): Promise<{ id: string }> {
    const id: string = await this.commandBus.execute(
      new CreateBookingCommand(
        Number(dto.userId),
        Number(dto.resourceId),
        new Date(dto.startsAt),
        new Date(dto.endsAt),
      ),
    );
    return { id: id };
  }

  @Patch(':id/confirm')
  async confirm(@Param('id') id: string) {
    await this.commandBus.execute(new ConfirmBookingCommand(Number(id)));
    return { id, status: 'CONFIRMED' };
  }

  @Delete(':id')
  async cancel(@Param('id') id: string) {
    await this.commandBus.execute(new CancelBookingCommand(Number(id)));
    return { id, status: 'CANCELLED' };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Booking | null> {
    return await this.queryBus.execute(new GetBookingQuery(Number(id)));
  }


  @Get()
  async listAvailability(
    @Query('resourceId') resourceId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ):Promise<Partial<Resource[]>> {
    if (!resourceId || !from || !to) {
      return [];
    }
    return await this.queryBus.execute(
      new ListAvailabilityQuery(resourceId, new Date(from), new Date(to)),
    );
  }
}
