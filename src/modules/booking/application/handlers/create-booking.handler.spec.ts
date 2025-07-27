
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

const mockDataSource = {
  transaction: jest.fn(),
};

describe('CreateBookingHandler', () => {
  let handler: CreateBookingHandler;
  let bookingRepository: IBookingRepository;
  let eventBus: EventBus;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateBookingHandler,
        {
          provide: 'IBookingRepository', // Use the string token for the interface
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
    dataSource = module.get<DataSource>(DataSource);

    jest.clearAllMocks();
  });

  describe('execute', () => {
    const command = new CreateBookingCommand(
      1, // resourceId
      1, // userId
      new Date('2025-08-01T10:00:00Z'),
      new Date('2025-08-01T11:00:00Z'),
    );

    it('should create a booking, publish an event, and return the new ID when no conflicts exist', async () => {
      const savedBookingId = 123;
      mockBookingRepository.findConflictingBookingsWithLock.mockResolvedValue([]);
      mockBookingRepository.save.mockResolvedValue(savedBookingId);


      mockDataSource.transaction.mockImplementation(async (callback) => {
        return await callback({} as EntityManager); // The manager can be an empty object for this test
      });

      const result = await handler.execute(command);

      expect(result).toEqual(savedBookingId);
      expect(
        mockBookingRepository.findConflictingBookingsWithLock,
      ).toHaveBeenCalledTimes(1);
      expect(mockBookingRepository.save).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publish).toHaveBeenCalledWith(
        expect.any(BookingHistoryEvent),
      );
    });

    it('should throw a ConflictException if conflicting bookings are found', async () => {

      mockBookingRepository.findConflictingBookingsWithLock.mockResolvedValue([
        new Booking({
        }),
      ]);

      mockDataSource.transaction.mockImplementation(async (callback) => {
        return await callback({} as EntityManager);
      });


      await expect(handler.execute(command)).rejects.toThrow(ConflictException);

      expect(mockBookingRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publish).not.toHaveBeenCalled();
    });
  });
});
