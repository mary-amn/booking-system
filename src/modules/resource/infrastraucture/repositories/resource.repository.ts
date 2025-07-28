import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from '../../domain/entities/resource.entity';
import { ResourceOrmEntity } from '../persistence/resource-orm.entity';
import { IResourceRepository } from '../../domain/repositories/resource.repository.interface';

@Injectable()
export class ResourceRepository implements IResourceRepository {
  constructor(
    @InjectRepository(ResourceOrmEntity)
    private readonly repo: Repository<ResourceOrmEntity>,
  ) {}

  private toDomain(orm: ResourceOrmEntity): Resource {
    const resource = new Resource({
      id: orm.id,
      capacity: orm.capacity,
      timezone: orm.timezone,
      name: orm.name,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
    return resource;
  }

  private toOrm(resource: Resource): ResourceOrmEntity {
    const orm = new ResourceOrmEntity();
    orm.id = resource.id;
    orm.name = resource.name;
    orm.capacity = resource.capacity;
    orm.timezone = resource.timezone;
    orm.createdAt = resource.createdAt;
    orm.updatedAt = resource.updatedAt;
    return orm;
  }

  async save(resource: Resource): Promise<number> {
    const orm = this.toOrm(resource);
    await this.repo.save(orm);
    return orm.id;
  }

  async findById(id: number): Promise<Resource> {
    const orm = await this.repo.findOne({ where: { id } });
    if (!orm) throw new NotFoundException(`Resource ${id} not found`);
    return this.toDomain(orm);
  }

  async listAll(): Promise<Resource[]> {
    const rows = await this.repo.find();
    return rows.map((r) => this.toDomain(r));
  }
}
