import {CommandHandler, EventBus, ICommandHandler} from '@nestjs/cqrs';

import {NotFoundException} from '@nestjs/common';
import {ConfirmBookingCommand} from '../commands/confirm-booking.command';
import {BookingRepository} from '../../infrastraucture/repositories/booking.repository';
import {BookingHistoryEvent} from '../events/impl/booking-history.event';
import {BookingStatus} from "../../infrastraucture/booking-status.enum";

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
      new BookingHistoryEvent(booking.id, booking.resourceId, booking.userId,BookingStatus.CONFIRMED),
    );
    await this.bookingRepo.save(booking);
  }
}
