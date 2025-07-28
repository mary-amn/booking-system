import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateBookingCommand } from '../commands/create-booking.command';
import { IBookingRepository } from '../../domain/repositories/booking-repository.interface';
import { Booking } from '../../domain/entities/booking.entity';
import { BookingStatus } from '../../infrastraucture/booking-status.enum';
import { BookingHistoryEvent } from '../events/impl/booking-history.event'; // Import DataSource // Assuming you have a Resource entity for TypeORM

@CommandHandler(CreateBookingCommand)
export class CreateBookingHandler
  implements ICommandHandler<CreateBookingCommand>
{
  constructor(
    private readonly dataSource: DataSource,
    @Inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateBookingCommand): Promise<number> {

    const result = await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        // Lock resource
        try {
          await transactionalEntityManager.query(
            'SELECT * FROM "resources" WHERE "id" = $1 FOR UPDATE',
            [command.resourceId],
          );
        } catch (error) {
          throw new ConflictException(
            `Resource with ID ${command.resourceId} could not be locked or found.`,
          );
        }

        // Check conflicts
        const conflictingBookings =
          await this.bookingRepository.findConflictingBookingsWithLock(
            command.resourceId,
            command.startsAt,
            command.endsAt,
            transactionalEntityManager,
          );

        if (conflictingBookings.length > 0) {
          throw new ConflictException(
            `Resource ${command.resourceId} is not available for the requested time period`,
          );
        }

        // Create booking
        const booking = Booking.create(
          command.resourceId,
          command.userId,
          command.startsAt,
          command.endsAt,
          BookingStatus.PENDING,
        );

        const savedId = await this.bookingRepository.save(booking);


        return {
          id: savedId,
          event: new BookingHistoryEvent(
            savedId,
            booking.resourceId,
            booking.userId,
            BookingStatus.PENDING,
          ),
        };
      },
    );

    // PUBLISH EVENT HERE - After transaction is committed
    this.eventBus.publish(result.event);

    return result.id;
  }
}
