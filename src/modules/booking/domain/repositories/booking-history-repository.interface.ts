import { BookingHistory } from '../entities/booking-history.entity';

export interface IBookingHistoryRepository {

  save(history: BookingHistory): Promise<void>;

  findByBookingId(bookingId: string): Promise<BookingHistory[]>;
}