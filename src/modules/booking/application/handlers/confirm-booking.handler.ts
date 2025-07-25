// src/modules/scheduling/application/handlers/confirm-booking.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { NotFoundException } from '@nestjs/common';
import { ConfirmBookingCommand } from '../commands/confirm-booking.command';
import { BookingRepository } from '../../infrastraucture/repositories/booking.repository';

@CommandHandler(ConfirmBookingCommand)
export class ConfirmBookingHandler
  implements ICommandHandler<ConfirmBookingCommand>
{
  constructor(private readonly bookingRepo: BookingRepository) {}

  async execute(cmd: ConfirmBookingCommand): Promise<void> {
    const booking = await this.bookingRepo.findById(cmd.bookingId);
    if (!booking) throw new NotFoundException('Booking not found');
    booking.confirm();
    await this.bookingRepo.save(booking);
  }
}
