// src/modules/scheduling/application/handlers/list-availability.handler.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListAvailabilityQuery } from '../queries/list-availability.query';
import { BookingRepository } from '../../../booking/infrastraucture/repositories/booking.repository';

@QueryHandler(ListAvailabilityQuery)
export class ListAvailabilityHandler
  implements IQueryHandler<ListAvailabilityQuery>
{
  constructor(private readonly bookingRepo: BookingRepository) {}

  async execute(q: ListAvailabilityQuery) {
    // List all non-cancelled bookings overlapping [from,to]
    const bookings = await this.bookingRepo.findOverlaps(q.resourceId, {
      start: q.from,
      end: q.to,
    } as any);
    return bookings.map((b) => ({
      id: b.id,
      startsAt: b.startsAt,
      endsAt: b.endsAt,
      status: b.status,
    }));
  }
}
