import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { CancelBookingHandler } from './cancel-booking.handler';
import { CancelBookingCommand } from '../commands/cancel-booking.command';
import { BookingRepository } from '../../infrastraucture/repositories/booking.repository';
import { Booking } from '../../domain/entities/booking.entity';
import { BookingHistoryEvent } from '../events/impl/booking-history.event';
import { BookingStatus } from '../../infrastraucture/booking-status.enum';

const mockBookingRepository = {
  findById: jest.fn(),
  save: jest.fn(),
};

const mockEventBus = {
  publish: jest.fn(),
};

describe('CancelBookingHandler', () => {
  let handler: CancelBookingHandler;
  let eventBus: EventBus;
  let bookingRepository: BookingRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CancelBookingHandler,
        {
          provide: BookingRepository,
          useValue: mockBookingRepository,
        },
        {
          provide: EventBus,
          useValue: mockEventBus,
        },
      ],
    }).compile();

    handler = module.get<CancelBookingHandler>(CancelBookingHandler);
    eventBus = module.get<EventBus>(EventBus);
    bookingRepository = module.get<BookingRepository>(BookingRepository);

    // Reset mocks before each test to ensure isolation
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should successfully cancel a booking and publish an event', async () => {
      // Arrange:
      const bookingId = 1;
      const command = new CancelBookingCommand(bookingId);

      const mockBooking = new Booking({
        id: bookingId,
        resourceId: 101,
        userId: 202,
        startsAt: new Date(),
        endsAt: new Date(),
        status: BookingStatus.CONFIRMED,
      });
      const cancelSpy = jest.spyOn(mockBooking, 'cancel');

      mockBookingRepository.findById.mockResolvedValue(mockBooking);

      await handler.execute(command);

      expect(mockBookingRepository.findById).toHaveBeenCalledWith(bookingId);
      expect(cancelSpy).toHaveBeenCalledTimes(1);
      expect(mockBookingRepository.save).toHaveBeenCalledWith(mockBooking);
      expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publish).toHaveBeenCalledWith(
        expect.any(BookingHistoryEvent),
      );
    });

    it('should throw a NotFoundException if the booking does not exist', async () => {
      const bookingId = 999; // An ID that won't be found
      const command = new CancelBookingCommand(bookingId);

      mockBookingRepository.findById.mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(NotFoundException);

      expect(mockBookingRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publish).not.toHaveBeenCalled();
    });
  });
});
