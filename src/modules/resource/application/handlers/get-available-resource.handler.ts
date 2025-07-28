import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAvailableResourcesQuery } from '../queries/get-available-resource.query';
import { IBookingRepository } from '../../../booking/domain/repositories/booking-repository.interface';
import { IResourceRepository } from '../../domain/repositories/resource.repository.interface';
import { Inject } from '@nestjs/common';

@QueryHandler(GetAvailableResourcesQuery)
export class GetAvailableResourcesHandler
  implements IQueryHandler<GetAvailableResourcesQuery>
{
  constructor(
    @Inject('IResourceRepository')
    private readonly resourceRepository: IResourceRepository,
    @Inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(query: GetAvailableResourcesQuery) {
    const { startTime, endTime } = query;

    const overlappingBookings =
      await this.bookingRepository.findOverlappingBookings(startTime, endTime);

    const unavailableResourceIds = overlappingBookings.map(
      (booking) => booking.resourceId,
    );

    const allResources = await this.resourceRepository.listAll();

    const availableResources = allResources.filter(
      (resource) => !unavailableResourceIds.find((x) => x === resource.id),
    );

    return availableResources;
  }
}
