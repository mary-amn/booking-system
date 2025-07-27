import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BookingRepository } from './booking.repository';
import { Booking } from '../../domain/entities/booking.entity';
import {BookingStatus} from "../booking-status.enum";
import {BookingOrmEntity} from "../persistence/booking-orm.entity";

describe('BookingRepository (Integration with PostgreSQL)', () => {
    jest.setTimeout(30000); // Keep the long timeout for DB connections

    let bookingRepository: BookingRepository;
    let dataSource: DataSource;

    // --- Test Data (no changes here) ---
    const resourceId = 1;
    const userId = 1;
    const existingBooking = Booking.create(
        resourceId,
        userId,
        new Date('2025-07-28T14:00:00Z'),
        new Date('2025-07-28T15:00:00Z'),
        BookingStatus.CONFIRMED,
    );

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                // Configure TypeORM to connect to the PostgreSQL test database
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: 'localhost',
                    port: 5433, // Use the mapped port from docker-compose
                    username: 'testuser',
                    password: 'testpassword',
                    database: 'booking_system_test',
                    entities: [BookingOrmEntity],
                    synchronize: true, // Auto-creates schema. ONLY for tests.
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
        await bookingRepository.save(existingBooking);
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    // ALL YOUR ACTUAL TEST LOGIC (`describe` and `it` blocks) REMAINS EXACTLY THE SAME.
    // This is the biggest benefit of this approach.
    describe('findOverlappingBookings', () => {
        it('should find a booking that starts during the new time slot', async () => {
            const startTime = new Date('2025-07-28T13:30:00Z');
            const endTime = new Date('2025-07-28T14:30:00Z');

            const overlapping = await bookingRepository.findOverlappingBookings(
                startTime,
                endTime,
            );

            expect(overlapping).toHaveLength(1);
            expect(overlapping[0].id).toEqual(existingBooking.id);
        });

        it('should NOT find a booking that is completely outside the new time slot', async () => {
            const startTime = new Date('2025-07-28T16:00:00Z');
            const endTime = new Date('2025-07-28T17:00:00Z');

            const overlapping = await bookingRepository.findOverlappingBookings(
                startTime,
                endTime,
            );

            expect(overlapping).toHaveLength(0);
        });
    });
});