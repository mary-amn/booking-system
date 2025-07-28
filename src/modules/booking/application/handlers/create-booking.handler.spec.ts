
import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { ConflictException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { CreateBookingHandler } from './create-booking.handler';
import { CreateBookingCommand } from '../commands/create-booking.command';
import { IBookingRepository } from '../../domain/repositories/booking-repository.interface';
import { Booking } from '../../domain/entities/booking.entity';
import { BookingHistoryEvent } from '../events/impl/booking-history.event';

const mockBookingRepository = {
  findConflictingBookingsWithLock: jest.fn(),
  save: jest.fn(),
};

const mockEventBus = {
  publish: jest.fn(),
};

const mockEntityManager = {
  query: jest.fn(),
} as unknown as EntityManager;

const mockDataSource = {
  transaction: jest.fn(),
};

describe('CreateBookingHandler', () => {
  let handler: CreateBookingHandler;
  let bookingRepository: IBookingRepository;
  let eventBus: EventBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateBookingHandler,
        {
          provide: 'IBookingRepository',
          useValue: mockBookingRepository,
        },
        {
          provide: EventBus,
          useValue: mockEventBus,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    handler = module.get<CreateBookingHandler>(CreateBookingHandler);
    bookingRepository = module.get<IBookingRepository>('IBookingRepository');
    eventBus = module.get<EventBus>(EventBus);

    jest.clearAllMocks();
  });

  describe('execute', () => {
    const command = new CreateBookingCommand(
      1, // resourceId
      1, // userId
      new Date('2025-08-01T10:00:00Z'),
      new Date('2025-08-01T11:00:00Z'),
    );

    it('should create a booking, publish an event after the transaction, and return the new ID', async () => {
      // Arrange:
      const savedBookingId = 123;
      const bookingHistoryEvent = new BookingHistoryEvent(
        savedBookingId,
        command.resourceId,
        command.userId,
        expect.any(String),
      );

      mockBookingRepository.findConflictingBookingsWithLock.mockResolvedValue([]);
      mockBookingRepository.save.mockResolvedValue(savedBookingId);

      mockDataSource.transaction.mockImplementation(async (callback) => {

        return await callback(mockEntityManager);
      });

      const result = await handler.execute(command);


      expect(result).toEqual(savedBookingId);

      expect(mockDataSource.transaction).toHaveBeenCalledTimes(1);

      expect(mockEntityManager.query).toHaveBeenCalledWith(
        'SELECT * FROM "resources" WHERE "id" = $1 FOR UPDATE',
        [command.resourceId],
      );

      // Check that the save method was called
      expect(mockBookingRepository.save).toHaveBeenCalledTimes(1);

      // Check that the event was published AFTER the transaction
      expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          bookingId: savedBookingId,
        }),
      );
    });

    it('should throw a ConflictException and not publish an event if conflicts are found', async () => {
      // Arrange:
      // Mock the repository to find an existing booking
      mockBookingRepository.findConflictingBookingsWithLock.mockResolvedValue([
        new Booking({
          /* mock booking data */
        }),
      ]);

      // Mock the transaction wrapper as before
      mockDataSource.transaction.mockImplementation(async (callback) => {
        return await callback(mockEntityManager);
      });

      // Act & Assert:
      // Expect the handler to reject with a ConflictException
      await expect(handler.execute(command)).rejects.toThrow(ConflictException);

      // Verify that no booking was saved and no event was published
      expect(mockBookingRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publish).not.toHaveBeenCalled();
    });
  });
});
