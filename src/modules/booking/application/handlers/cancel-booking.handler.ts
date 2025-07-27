import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CancelBookingCommand } from '../commands/cancel-booking.command';
import { NotFoundException } from '@nestjs/common';
import { BookingRepository } from '../../infrastraucture/repositories/booking.repository';
import { BookingStatus } from '../../infrastraucture/booking-status.enum';
import { BookingHistoryEvent } from '../events/impl/booking-history.event';

@CommandHandler(CancelBookingCommand)
export class CancelBookingHandler
  implements ICommandHandler<CancelBookingCommand>
{
  constructor(
    private readonly bookingRepo: BookingRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(cmd: CancelBookingCommand): Promise<void> {
    const booking = await this.bookingRepo.findById(cmd.bookingId);
    if (!booking) {
      throw new NotFoundException(
        'Booking not found with ID: ' + cmd.bookingId,
      );
    }
    booking.cancel();
    this.eventBus.publish(
      new BookingHistoryEvent(
        booking.id,
        booking.resourceId,
        booking.userId,
        BookingStatus.CANCELLED,
      ),
    );

    await this.bookingRepo.save(booking);
  }
}
