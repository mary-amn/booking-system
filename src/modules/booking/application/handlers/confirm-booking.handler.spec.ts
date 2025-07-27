import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { ConfirmBookingHandler } from './confirm-booking.handler';
import { ConfirmBookingCommand } from '../commands/confirm-booking.command';
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

describe('ConfirmBookingHandler', () => {
  let handler: ConfirmBookingHandler;
  let eventBus: EventBus;
  let bookingRepository: BookingRepository;

  // 2. SETUP: Before each test, create a fresh instance of the handler with the mocks.
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfirmBookingHandler,
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

    handler = module.get<ConfirmBookingHandler>(ConfirmBookingHandler);
    eventBus = module.get<EventBus>(EventBus);
    bookingRepository = module.get<BookingRepository>(BookingRepository);

    // Reset mocks before each test to ensure isolation
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should successfully confirm a booking and publish an event', async () => {
      // Arrange:
      const bookingId = 1;
      const command = new ConfirmBookingCommand(bookingId);

      // Create a mock domain entity to be "found" by the repository
      const mockBooking = new Booking({
        id: bookingId,
        resourceId: 101,
        userId: 202,
        startsAt: new Date(),
        endsAt: new Date(),
        status: BookingStatus.PENDING, // A booking must be PENDING to be confirmed
      });
      const confirmSpy = jest.spyOn(mockBooking, 'confirm');

      mockBookingRepository.findById.mockResolvedValue(mockBooking);

      await handler.execute(command);

      expect(mockBookingRepository.findById).toHaveBeenCalledWith(bookingId);
      expect(confirmSpy).toHaveBeenCalledTimes(1);
      expect(mockBookingRepository.save).toHaveBeenCalledWith(mockBooking);
      expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
      expect(mockEventBus.publish).toHaveBeenCalledWith(
        expect.any(BookingHistoryEvent),
      );
    });

    it('should throw a NotFoundException if the booking does not exist', async () => {
      const bookingId = 999; // An ID that won't be found
      const command = new ConfirmBookingCommand(bookingId);

      mockBookingRepository.findById.mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(NotFoundException);

      expect(mockBookingRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publish).not.toHaveBeenCalled();
    });
  });
});
