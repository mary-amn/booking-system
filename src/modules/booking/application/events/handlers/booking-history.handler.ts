import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BookingConfirmedEvent } from '../impl/booking-confirmed.event';
import { BookingStatus } from '../../../infrastraucture/booking-status.enum';
import { IBookingHistoryRepository } from '../../../domain/repositories/booking-history-repository.interface';
import { Inject } from '@nestjs/common';
import { BookingHistory } from '../../../domain/entities/booking-history.entity';

@EventsHandler(BookingConfirmedEvent)
export class BookingHistoryHandler
  implements IEventHandler<BookingConfirmedEvent>
{
  constructor(
    @Inject('IBookingHistoryRepository') // Inject your new repository
    private readonly historyRepository: IBookingHistoryRepository,
  ) {}

  async handle(event: BookingConfirmedEvent) {
    const bookingHistory = BookingHistory.create(
      event.bookingId,
      BookingStatus.CONFIRMED,
      new Date(),
      {
        resourceId: event.resourceId,
        confirmedBy: event.confirmedByUserId,
      },
    );
    return await this.historyRepository.save(bookingHistory);
  }
}
