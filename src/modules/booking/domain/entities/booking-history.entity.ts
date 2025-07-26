import { BookingStatus } from '../../infrastraucture/booking-status.enum';

export class BookingHistory {
  id: number;
  bookingId: number;
  eventType: BookingStatus;
  timestamp: Date;
  details: Record<string, any>;

  constructor(init?: Partial<BookingHistory>) {
    Object.assign(this, init);
  }

  static create(
    bookingId: number,
    eventType: BookingStatus,
    timestamp: Date,
    details: Record<string, any>,
  ): BookingHistory {
    return new BookingHistory({
      bookingId,
      eventType,
      timestamp,
      details,
    });
  }
}
