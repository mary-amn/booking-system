// src/modules/scheduling/application/handlers/confirm-booking.handler.ts
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';

import { NotFoundException } from '@nestjs/common';
import { ConfirmBookingCommand } from '../commands/confirm-booking.command';
import { BookingRepository } from '../../infrastraucture/repositories/booking.repository';
import { BookingConfirmedEvent } from '../events/impl/booking-confirmed.event';

@CommandHandler(ConfirmBookingCommand)
export class ConfirmBookingHandler
  implements ICommandHandler<ConfirmBookingCommand>
{
  constructor(
    private readonly bookingRepo: BookingRepository,
    private readonly eventBus: EventBus, // Inject the EventBus
  ) {}

  async execute(cmd: ConfirmBookingCommand): Promise<void> {
    const booking = await this.bookingRepo.findById(cmd.bookingId);
    if (!booking) throw new NotFoundException('Booking not found');
    booking.confirm();
    this.eventBus.publish(
      new BookingConfirmedEvent(booking.id, booking.resourceId, booking.userId),
    );
    await this.bookingRepo.save(booking);
  }
}
