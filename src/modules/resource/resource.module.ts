// src/modules/scheduling/scheduling.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceRepository } from './infrastraucture/repositories/resource.repository';
import { ResourceOrmEntity } from './infrastraucture/persistence/resource-orm.entity';
import { ListAvailabilityHandler } from './application/handlers/list-availability.handler';
import { CqrsModule } from '@nestjs/cqrs';
// ...

const queryHandlers = [ListAvailabilityHandler];
@Module({
  imports: [TypeOrmModule.forFeature([ResourceOrmEntity]), CqrsModule],
  providers: [ResourceRepository,...queryHandlers],
  exports: [ResourceRepository],
})
export class SchedulingModule {}
