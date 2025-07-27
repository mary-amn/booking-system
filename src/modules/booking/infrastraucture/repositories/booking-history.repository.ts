
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IBookingHistoryRepository } from '../../domain/repositories/booking-history-repository.interface';
import { BookingHistory } from '../../domain/entities/booking-history.entity';
import { BookingHistoryOrmEntity } from '../persistence/booking-history-orm.entity';

@Injectable()
export class BookingHistoryRepository implements IBookingHistoryRepository {
  constructor(
    // Inject the raw TypeORM repository for the BookingHistory entity
    @InjectRepository(BookingHistoryOrmEntity)
    private readonly historyOrmRepository: Repository<BookingHistoryOrmEntity>,
  ) {}


  async save(history: BookingHistory): Promise<void> {
    const historyRecord = this.historyOrmRepository.create(history);
    await this.historyOrmRepository.save(historyRecord);
  }


  async findByBookingId(bookingId: number): Promise<BookingHistory[]> {
    return this.historyOrmRepository.find({
      where: { bookingId },
      order: { timestamp: 'ASC' }, // Order chronologically
    });
  }
}
