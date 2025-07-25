// src/modules/scheduling/interfaces/rest/resource.controller.ts
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';

import { Resource } from '../../domain/entities/resource.entity';
import { ResourceRepository } from '../../infrastraucture/repositories/resource.repository';
import { CreateResourceDto } from '../dto/create-resource.dto';
import { ListAvailabilityQuery } from '../../../booking/application/queries/list-availability.query';
import { QueryBus } from '@nestjs/cqrs';

@Controller('resources')
export class ResourceController {
  constructor(
    private readonly repo: ResourceRepository,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() dto: CreateResourceDto) {
    const id = await this.repo.save(
      // domain-level Resource.create factory
      Resource.create(dto.name, dto.capacity ?? 1, dto.timezone ?? 'UTC'),
    );
    return { id };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.repo.findById(Number(id));
  }

  @Get()
  async findAll() {
    return await this.repo.listAll();
  }

}
