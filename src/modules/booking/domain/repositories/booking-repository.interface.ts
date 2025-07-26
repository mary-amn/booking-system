import { Booking } from '../entities/booking.entity';

export interface BookingReader {
  findByResource(resourceId: number, from: Date, to: Date): Promise<Booking[]>;
  findOverlappingBookings(startTime: Date, endTime: Date): Promise<Booking[]>;
  findByUser(userId: number): Promise<Booking[]>;
  findById(id: number): Promise<Booking | null>;
}

export interface BookingWriter {
  save(booking: Booking): Promise<void>;
}

export interface IBookingRepository extends BookingReader, BookingWriter {}
