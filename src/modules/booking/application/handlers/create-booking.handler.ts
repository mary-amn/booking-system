import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateBookingCommand } from '../commands/create-booking.command';
import { IBookingRepository } from '../../domain/repositories/booking-repository.interface';
import { Booking } from '../../domain/entities/booking.entity';
import { BookingStatus } from '../../infrastraucture/booking-status.enum'; // Import DataSource // Assuming you have a Resource entity for TypeORM

@CommandHandler(CreateBookingCommand)
export class CreateBookingHandler
  implements ICommandHandler<CreateBookingCommand>
{
  constructor(
    // Inject the main DataSource to get access to the query runner
    private readonly dataSource: DataSource,
    @Inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(command: CreateBookingCommand): Promise<void> {
    return await this.dataSource.transaction(async (manager) => {
      // 1. Lock approach: Check availability WITH row locking
      const conflictingBookings =
        await this.bookingRepository.findConflictingBookingsWithLock(
          command.resourceId,
          command.startsAt,
          command.endsAt,
           manager
        );

      if (conflictingBookings.length > 0) {
        throw new ConflictException(
          `Resource ${command.resourceId} is not available for the requested time period`,
        );
      }

      // 2. Create booking within the same transaction
      const booking = Booking.create(
        command.resourceId,
        command.userId,

        command.startsAt,
        command.endsAt,
        BookingStatus.PENDING,
      );

      const savedBooking = await this.bookingRepository.save(booking);

      return savedBooking;
    });
  }
}
