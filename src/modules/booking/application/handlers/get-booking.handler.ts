import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBookingQuery } from '../queries/get-booking.query';
import { NotFoundException } from '@nestjs/common';
import { BookingRepository } from '../../infrastraucture/repositories/booking.repository';

@QueryHandler(GetBookingQuery)
export class GetBookingHandler implements IQueryHandler<GetBookingQuery> {
  constructor(private readonly bookingRepo: BookingRepository) {}

  async execute(query: GetBookingQuery) {
    const booking = await this.bookingRepo.findById(query.bookingId);
    if (!booking) {
      throw new NotFoundException(
        'Booking not found with ID: ' + query.bookingId,
      );
    }
    return {
      id: booking.id,
      userId: booking.userId,
      resourceId: booking.resourceId,
      startsAt: booking.startsAt,
      endsAt: booking.endsAt,
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };
  }
}
