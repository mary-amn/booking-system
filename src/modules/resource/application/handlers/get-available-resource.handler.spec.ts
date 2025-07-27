
import { Test, TestingModule } from '@nestjs/testing';
import { GetAvailableResourcesQuery } from '../queries/get-available-resource.query';
import { Resource } from '../../domain/entities/resource.entity';
import { Booking } from '../../../booking/domain/entities/booking.entity';
import { GetAvailableResourcesHandler } from './get-available-resource.handler';

const mockResourceRepository = {
  listAll: jest.fn(),
};

const mockBookingRepository = {
  findOverlappingBookings: jest.fn(),
};

describe('GetAvailableResourcesHandler', () => {
  let handler: GetAvailableResourcesHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAvailableResourcesHandler,
        {
          provide: 'IResourceRepository',
          useValue: mockResourceRepository,
        },
        {
          provide: 'IBookingRepository',
          useValue: mockBookingRepository,
        },
      ],
    }).compile();

    handler = module.get<GetAvailableResourcesHandler>(
      GetAvailableResourcesHandler,
    );

    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return only the resources that are not booked during the given time slot', async () => {
      const query = new GetAvailableResourcesQuery(
        new Date('2025-08-01T10:00:00Z'),
        new Date('2025-08-01T11:00:00Z'),
      );

      const allResources = [
        new Resource({ id: 1, name: 'Room A' }),
        new Resource({ id: 2, name: 'Room B' }), // This room will be booked
        new Resource({ id: 3, name: 'Room C' }),
      ];

      const overlappingBookings = [
        new Booking({
          id: 101,
          resourceId: 2, // Booking for Room B
          userId: 1,
          startsAt: new Date(),
          endsAt: new Date(),
        }),
      ];

      mockResourceRepository.listAll.mockResolvedValue(allResources);
      mockBookingRepository.findOverlappingBookings.mockResolvedValue(
        overlappingBookings,
      );

      const result = await handler.execute(query);

      expect(mockResourceRepository.listAll).toHaveBeenCalledTimes(1);
      expect(
        mockBookingRepository.findOverlappingBookings,
      ).toHaveBeenCalledWith(query.startTime, query.endTime);

      expect(result).toHaveLength(2);
      expect(result.map((r) => r.id)).toEqual([1, 3]);
    });

    it('should return all resources if there are no overlapping bookings', async () => {
      const query = new GetAvailableResourcesQuery(
        new Date('2025-08-01T10:00:00Z'),
        new Date('2025-08-01T11:00:00Z'),
      );

      const allResources = [
        new Resource({ id: 1, name: 'Room A' }),
        new Resource({ id: 2, name: 'Room B' }),
      ];

      mockBookingRepository.findOverlappingBookings.mockResolvedValue([]);
      mockResourceRepository.listAll.mockResolvedValue(allResources);

      const result = await handler.execute(query);

      expect(result).toHaveLength(2);
      expect(result.map((r) => r.id)).toEqual([1, 2]);
    });
  });
});
