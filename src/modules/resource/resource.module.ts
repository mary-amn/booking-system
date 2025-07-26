import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceRepository } from './infrastraucture/repositories/resource.repository';
import { ResourceOrmEntity } from './infrastraucture/persistence/resource-orm.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ResourceController } from './interface/rest/resource.controller';
import { BookingModule } from '../booking/booking.module';
import { GetAvailableResourcesHandler } from './application/handlers/get-available-resource.handler';

export const QueryHandlers = [GetAvailableResourcesHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([ResourceOrmEntity]),
    CqrsModule,
    BookingModule,
  ],
  providers: [
    ResourceRepository,
    ...QueryHandlers,
    {
      provide: 'IResourceRepository', // Use a string token or the interface
      useClass: ResourceRepository,
    },
  ],
  exports: [ResourceRepository, 'IResourceRepository'],
  controllers: [ResourceController],
})
export class ResourceModule {}
