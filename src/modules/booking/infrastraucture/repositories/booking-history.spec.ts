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

  // 1. SETUP: Connect to the PostgreSQL test database.
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

  // 2. CLEANUP: Clear the history table before each test.
  beforeEach(async () => {
    await dataSource.getRepository(BookingHistoryOrmEntity).clear();
  });

  // 3. TEARDOWN: Close the connection after all tests.
  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('save and findByBookingId', () => {
    it('should save multiple history records and retrieve them in chronological order', async () => {
      // Arrange: Create two history events for the same booking
      const createdEvent = new BookingHistory();
      createdEvent.bookingId = bookingId;
      createdEvent.eventType = BookingStatus.PENDING;
      createdEvent.details = { createdBy: 1 };

      // We need to manually add a slight delay to ensure timestamps are different
      await new Promise((resolve) => setTimeout(resolve, 10));

      const confirmedEvent = new BookingHistory();
      confirmedEvent.bookingId = bookingId;
      confirmedEvent.eventType = BookingStatus.CONFIRMED;
      confirmedEvent.details = { confirmedBy: 1 };

      // Act: Save both records
      await historyRepository.save(createdEvent);
      await historyRepository.save(confirmedEvent);

      // Assert: Retrieve the records and check their content and order
      const foundHistory = await historyRepository.findByBookingId(bookingId);

      expect(foundHistory).toHaveLength(2);
      expect(foundHistory[0].eventType).toEqual(BookingStatus.PENDING);
      expect(foundHistory[1].eventType).toEqual(BookingStatus.CONFIRMED);
    });

    it('should return an empty array if no history exists for a bookingId', async () => {
      // Arrange: A booking ID that has no history records
      const nonExistentBookingId = 999;

      // Act: Attempt to find history for it
      const foundHistory =
        await historyRepository.findByBookingId(nonExistentBookingId);

      // Assert: The result should be an empty array
      expect(foundHistory).toHaveLength(0);
    });
  });
});
