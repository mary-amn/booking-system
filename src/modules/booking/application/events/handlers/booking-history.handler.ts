import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BookingHistoryEvent } from '../impl/booking-history.event';
import { IBookingHistoryRepository } from '../../../domain/repositories/booking-history-repository.interface';
import { Inject } from '@nestjs/common';
import { BookingHistory } from '../../../domain/entities/booking-history.entity';

@EventsHandler(BookingHistoryEvent)
export class BookingHistoryHandler
  implements IEventHandler<BookingHistoryEvent>
{
  constructor(
    @Inject('IBookingHistoryRepository') // Inject your new repository
    private readonly historyRepository: IBookingHistoryRepository,
  ) {}

  async handle(event: BookingHistoryEvent) {

    const bookingHistory = BookingHistory.create(
      event.bookingId,
      event.eventType,
      new Date(),
      {
        resourceId: event.resourceId,
        confirmedBy: event.confirmedByUserId,
      },
    );
    return await this.historyRepository.save(bookingHistory);
  }
}
