// src/modules/scheduling/scheduling.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceRepository } from './infrastraucture/repositories/resource.repository';
import { ResourceOrmEntity } from './infrastraucture/persistence/resource-orm.entity';
// ...
@Module({
  imports: [TypeOrmModule.forFeature([ResourceOrmEntity])],
  providers: [ResourceRepository],
  exports: [ResourceRepository],
})
export class SchedulingModule {}
