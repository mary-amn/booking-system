// src/modules/scheduling/application/handlers/create-booking.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBookingCommand } from '../commands/create-booking.command';

import { BookingRepository } from '../../infrastraucture/repositories/booking.repository';
import { Booking } from '../../domain/entities/booking.entity';
import { BookingStatus } from '../../infrastraucture/booking-status.enum';
import { TimeSlot } from '../../domain/value-objects/timeSlot.vo';

@CommandHandler(CreateBookingCommand)
export class CreateBookingHandler
  implements ICommandHandler<CreateBookingCommand>
{
  constructor(private readonly bookingRepo: BookingRepository) {}

  async execute(cmd: CreateBookingCommand): Promise<string> {
    const slot = TimeSlot.create(cmd.startsAt, cmd.endsAt);
    const conflicts = await this.bookingRepo.findOverlaps(cmd.resourceId, slot);
    if (conflicts.length > 0) {
      throw new Error('Resource is already booked for the given time slot');
    }
    const booking = Booking.create(
      cmd.resourceId,
      cmd.userId,
      cmd.startsAt,
      cmd.endsAt,
      BookingStatus.PENDING,
    );

    await this.bookingRepo.save(booking);
    return booking.id;
  }
}
