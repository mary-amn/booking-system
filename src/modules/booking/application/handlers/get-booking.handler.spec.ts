
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetBookingHandler } from './get-booking.handler';
import { GetBookingQuery } from '../queries/get-booking.query';
import { BookingRepository } from '../../infrastraucture/repositories/booking.repository';
import { Booking } from '../../domain/entities/booking.entity';
import { BookingStatus } from '../../infrastraucture/booking-status.enum';

const mockBookingRepository = {
  findById: jest.fn(),
};

describe('GetBookingHandler', () => {
  let handler: GetBookingHandler;
  let bookingRepository: BookingRepository;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetBookingHandler,
        {
          provide: BookingRepository,
          useValue: mockBookingRepository,
        },
      ],
    }).compile();

    handler = module.get<GetBookingHandler>(GetBookingHandler);
    bookingRepository = module.get<BookingRepository>(BookingRepository);

    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should find and return a booking DTO when the booking exists', async () => {
      // Arrange:
      const bookingId = 1;
      const query = new GetBookingQuery(bookingId);

      const mockBooking = new Booking({
        id: bookingId,
        resourceId: 101,
        userId: 202,
        startsAt: new Date('2025-08-01T10:00:00Z'),
        endsAt: new Date('2025-08-01T11:00:00Z'),
        status: BookingStatus.CONFIRMED,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockBookingRepository.findById.mockResolvedValue(mockBooking);

      const result = await handler.execute(query);


      expect(mockBookingRepository.findById).toHaveBeenCalledWith(bookingId);

      expect(result).toEqual({
        id: mockBooking.id,
        userId: mockBooking.userId,
        resourceId: mockBooking.resourceId,
        startsAt: mockBooking.startsAt,
        endsAt: mockBooking.endsAt,
        status: mockBooking.status,
        createdAt: mockBooking.createdAt,
        updatedAt: mockBooking.updatedAt,
      });
    });

    it('should throw a NotFoundException if the booking does not exist', async () => {
      const bookingId = 999; // An ID that won't be found
      const query = new GetBookingQuery(bookingId);

      mockBookingRepository.findById.mockResolvedValue(null);

      await expect(handler.execute(query)).rejects.toThrow(NotFoundException);
    });
  });
});
