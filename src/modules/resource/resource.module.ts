// src/modules/scheduling/scheduling.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceRepository } from './infrastraucture/repositories/resource.repository';
import { ResourceOrmEntity } from './infrastraucture/persistence/resource-orm.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ResourceController } from './interface/rest/resource.controller';
// ...

@Module({
  imports: [TypeOrmModule.forFeature([ResourceOrmEntity]), CqrsModule],
  providers: [ResourceRepository],
  exports: [ResourceRepository],
  controllers: [ResourceController],
})
export class ResourceModule {}
