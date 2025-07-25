import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from '../../domain/entities/resource.entity';
import { ResourceOrmEntity } from '../persistence/resource-orm.entity';

@Injectable()
export class ResourceRepository {
  constructor(
    @InjectRepository(ResourceOrmEntity)
    private readonly repo: Repository<ResourceOrmEntity>,
  ) {}

  private toDomain(orm: ResourceOrmEntity): Resource {
    return Resource.create(orm.name, orm.capacity, orm.timezone);
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

  async save(resource: Resource): Promise<void> {
    const orm = this.toOrm(resource);
    await this.repo.save(orm);
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
