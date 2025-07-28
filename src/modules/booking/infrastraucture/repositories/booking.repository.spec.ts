import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Booking } from '../../domain/entities/booking.entity';
import { BookingRepository } from './booking.repository';
import { BookingStatus } from '../booking-status.enum';
import { BookingOrmEntity } from '../persistence/booking-orm.entity';

describe('BookingRepository (Integration with PostgreSQL)', () => {
  jest.setTimeout(30000);

  let bookingRepository: BookingRepository;
  let dataSource: DataSource;
  let testBookingId: number;

  // --- Test Data ---
  const resourceId = 1;
  const userId = 1;
  // A booking from 2 PM to 3 PM
  const bookingToSave = Booking.create(
    resourceId,
    userId,
    new Date('2025-07-29T14:00:00Z'),
    new Date('2025-07-29T15:00:00Z'),
    BookingStatus.CONFIRMED,
  );

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
          entities: [BookingOrmEntity],
          synchronize: true, // Creates schema. ONLY for tests.
        }),
        TypeOrmModule.forFeature([BookingOrmEntity]),
      ],
      providers: [BookingRepository],
    }).compile();

    bookingRepository = module.get<BookingRepository>(BookingRepository);
    dataSource = module.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    await dataSource.getRepository(BookingOrmEntity).clear();
    testBookingId = await bookingRepository.save(bookingToSave);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('save and findById', () => {
    it('should correctly save a booking and retrieve it by its ID', async () => {
      const foundBooking = await bookingRepository.findById(testBookingId);

      expect(foundBooking).not.toBeNull();
      expect(foundBooking!.id).toEqual(testBookingId);
      expect(foundBooking!.resourceId).toEqual(resourceId.toString());
    });
  });

  describe('findOverlappingBookings', () => {
    it('should find a booking when the search range is fully contained within it', async () => {
      const startTime = new Date('2025-07-29T14:15:00Z'); // 2:15 PM
      const endTime = new Date('2025-07-29T14:45:00Z'); // 2:45 PM

      const result = await bookingRepository.findOverlappingBookings(
        startTime,
        endTime,
      );
      expect(result).toHaveLength(1);
      expect(result[0].id).toEqual(testBookingId);
    });

    it('should NOT find a booking when the search range is completely outside', async () => {
      const startTime = new Date('2025-07-29T16:00:00Z'); // 4 PM
      const endTime = new Date('2025-07-29T17:00:00Z'); // 5 PM

      const result = await bookingRepository.findOverlappingBookings(
        startTime,
        endTime,
      );
      expect(result).toHaveLength(0);
    });
  });

  describe('findConflictingBookingsWithLock', () => {
    it('should find a conflicting booking within a transaction', async () => {
      // Manually create a transaction to test the method
      await dataSource.transaction(async (transactionalEntityManager) => {
        const startTime = new Date('2025-07-29T14:30:00Z'); // 2:30 PM
        const endTime = new Date('2025-07-29T15:30:00Z'); // 3:30 PM

        const result = await bookingRepository.findConflictingBookingsWithLock(
          resourceId,
          startTime,
          endTime,
          transactionalEntityManager,
        );

        expect(result).toHaveLength(1);
        expect(result[0].id).toEqual(testBookingId);
      });
    });

    it('should not find a conflicting booking if the resource ID is different', async () => {
      await dataSource.transaction(async (transactionalEntityManager) => {
        const differentResourceId = 999;
        const startTime = new Date('2025-07-29T14:30:00Z');
        const endTime = new Date('2025-07-29T15:30:00Z');

        const result = await bookingRepository.findConflictingBookingsWithLock(
          differentResourceId,
          startTime,
          endTime,
          transactionalEntityManager,
        );

        expect(result).toHaveLength(0);
      });
    });

    it('should not find a booking that has been cancelled', async () => {
      const booking = await bookingRepository.findById(testBookingId);
      booking!.status = BookingStatus.CANCELLED;
      await bookingRepository.save(booking!);

      await dataSource.transaction(async (transactionalEntityManager) => {
        const startTime = new Date('2025-07-29T14:30:00Z');
        const endTime = new Date('2025-07-29T15:30:00Z');

        const result = await bookingRepository.findConflictingBookingsWithLock(
          resourceId,
          startTime,
          endTime,
          transactionalEntityManager,
        );

        expect(result).toHaveLength(0);
      });
    });
  });
});
