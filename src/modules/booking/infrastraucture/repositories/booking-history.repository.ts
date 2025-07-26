/* File: src/modules/booking/domain/repositories/booking-history.repository.interface.ts
  --------------------------------------------------------------------------------------
  This interface defines the contract for our BookingHistory repository. It lives in the
  domain layer and has no knowledge of the database technology being used.
*/
import { BookingHistory } from '../booking-history.entity';

export interface IBookingHistoryRepository {
  /**
   * Saves a new history record to the persistence layer.
   * @param history - The BookingHistory entity to save.
   */
  save(history: BookingHistory): Promise<void>;

  /**
   * Retrieves all history records for a specific booking, ordered by timestamp.
   * @param bookingId - The ID of the booking to retrieve history for.
   * @returns A promise that resolves to an array of BookingHistory records.
   */
  findByBookingId(bookingId: string): Promise<BookingHistory[]>;
}


/* File: src/modules/booking/infrastructure/persistence/booking-history.repository.ts
  -----------------------------------------------------------------------------------
  This is the concrete implementation of the IBookingHistoryRepository. It uses TypeORM's
  Repository to interact with the PostgreSQL database.
*/
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingHistory } from '../../domain/booking-history.entity';
import { IBookingHistoryRepository } from '../../domain/repositories/booking-history.repository.interface';

@Injectable()
export class BookingHistoryRepository implements IBookingHistoryRepository {
  constructor(
    // Inject the raw TypeORM repository for the BookingHistory entity
    @InjectRepository(BookingHistory)
    private readonly historyOrmRepository: Repository<BookingHistory>,
  ) {}

  /**
   * Saves a new history record to the database.
   */
  async save(history: BookingHistory): Promise<void> {
    // The .create() method ensures we are creating a new instance of the ORM entity
    const historyRecord = this.historyOrmRepository.create(history);
    await this.historyOrmRepository.save(historyRecord);
  }

  /**
   * Finds all history records for a given bookingId.
   */
  async findByBookingId(bookingId: string): Promise<BookingHistory[]> {
    return this.historyOrmRepository.find({
      where: { bookingId },
      order: { timestamp: 'ASC' }, // Order chronologically
    });
  }
}
