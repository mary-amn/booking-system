import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CancelBookingCommand } from '../commands/cancel-booking.command';
import { NotFoundException } from '@nestjs/common';
import { BookingRepository } from '../../infrastraucture/repositories/booking.repository';

@CommandHandler(CancelBookingCommand)
export class CancelBookingHandler
  implements ICommandHandler<CancelBookingCommand>
{
  constructor(private readonly bookingRepo: BookingRepository) {}

  async execute(cmd: CancelBookingCommand): Promise<void> {
    const booking = await this.bookingRepo.findById(cmd.bookingId);
    if (!booking) {
      throw new NotFoundException(
        'Booking not found with ID: ' + cmd.bookingId,
      );
    }
    booking.cancel();
    await this.bookingRepo.save(booking);
  }
}
