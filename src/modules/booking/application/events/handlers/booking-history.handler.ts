
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingConfirmedEvent } from '../impl/booking-confirmed.event';
import { BookingHistory } from '../../../infrastraucture/persistence/booking-history-orm.entity';
import { BookingStatus } from '../../../infrastraucture/booking-status.enum';


@EventsHandler(BookingConfirmedEvent)
export class BookingHistoryHandler
  implements IEventHandler<BookingConfirmedEvent>
{
  constructor(
    @InjectRepository(BookingHistory)
    private readonly historyRepository: Repository<BookingHistory>,
  ) {}

  async handle(event: BookingConfirmedEvent) {
    const historyRecord = this.historyRepository.create({
      bookingId: event.bookingId,
      eventType: BookingStatus.CONFIRMED,
      details: {
        resourceId: event.resourceId,
        confirmedBy: event.confirmedByUserId,
      },
    });

    await this.historyRepository.save(historyRecord);
  }
}
