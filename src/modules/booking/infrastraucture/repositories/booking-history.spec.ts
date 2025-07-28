import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BookingHistoryRepository } from './booking-history.repository';
import { BookingHistory } from '../../domain/entities/booking-history.entity';
import { BookingHistoryOrmEntity } from '../persistence/booking-history-orm.entity';
import { BookingStatus } from '../booking-status.enum';

describe('BookingHistoryRepository (Integration with PostgreSQL)', () => {
  jest.setTimeout(30000);

  let historyRepository: BookingHistoryRepository;
  let dataSource: DataSource;

  // --- Test Data ---
  const bookingId = 123;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'testuser',
          password: 'testpassword',
          database: 'booking_system_test',
          entities: [BookingHistoryOrmEntity], // Register the entity for this test
          synchronize: true,
        }),
        TypeOrmModule.forFeature([BookingHistoryOrmEntity]),
      ],
      providers: [BookingHistoryRepository],
    }).compile();

    historyRepository = module.get<BookingHistoryRepository>(
      BookingHistoryRepository,
    );
    dataSource = module.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    await dataSource.getRepository(BookingHistoryOrmEntity).clear();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('save and findByBookingId', () => {
    it('should save multiple history records and retrieve them in chronological order', async () => {
      const createdEvent = new BookingHistory();
      createdEvent.bookingId = bookingId;
      createdEvent.eventType = BookingStatus.PENDING;
      createdEvent.details = { createdBy: 1 };

      await new Promise((resolve) => setTimeout(resolve, 10));

      const confirmedEvent = new BookingHistory();
      confirmedEvent.bookingId = bookingId;
      confirmedEvent.eventType = BookingStatus.CONFIRMED;
      confirmedEvent.details = { confirmedBy: 1 };

      await historyRepository.save(createdEvent);
      await historyRepository.save(confirmedEvent);

      const foundHistory = await historyRepository.findByBookingId(bookingId);

      expect(foundHistory).toHaveLength(2);
      expect(foundHistory[0].eventType).toEqual(BookingStatus.PENDING);
      expect(foundHistory[1].eventType).toEqual(BookingStatus.CONFIRMED);
    });

    it('should return an empty array if no history exists for a bookingId', async () => {
      const nonExistentBookingId = 999;

      const foundHistory =
        await historyRepository.findByBookingId(nonExistentBookingId);

      expect(foundHistory).toHaveLength(0);
    });
  });
});
