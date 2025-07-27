import { BookingHistory } from '../entities/booking-history.entity';

export interface BookingHistoryReader {
  findByBookingId(bookingId: number): Promise<BookingHistory[]>;
}

export interface BookingHistoryWriter {
  save(history: BookingHistory): Promise<void>;
}

export interface IBookingHistoryRepository
  extends BookingHistoryReader,
    BookingHistoryWriter {}
