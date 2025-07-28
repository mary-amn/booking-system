import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ResourceRepository } from './resource.repository';
import { Resource } from '../../domain/entities/resource.entity';
import { ResourceOrmEntity } from '../persistence/resource-orm.entity';

describe('ResourceRepository (Integration with PostgreSQL)', () => {
  jest.setTimeout(30000);

  let resourceRepository: ResourceRepository;
  let dataSource: DataSource;
  let savedResourceId: number;

  // --- Test Data ---
  const resourceToSave = new Resource({
    name: 'Test Room 101',
    capacity: 10,
    timezone: 'UTC',
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'testuser',
          password: 'testpassword',
          database: 'booking_system_test',
          entities: [ResourceOrmEntity], // Register the entity for this test
          synchronize: true,
        }),
        TypeOrmModule.forFeature([ResourceOrmEntity]),
      ],
      providers: [ResourceRepository],
    }).compile();

    resourceRepository = module.get<ResourceRepository>(ResourceRepository);
    dataSource = module.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    const repo = dataSource.getRepository(ResourceOrmEntity);
    await repo.clear();
    const savedOrmEntity = await repo.save(resourceToSave);
    savedResourceId = savedOrmEntity.id;
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('findById', () => {
    it('should find and return a resource by its ID', async () => {
      const foundResource = await resourceRepository.findById(savedResourceId);

      expect(foundResource).toBeInstanceOf(Resource);
      expect(foundResource.id).toEqual(savedResourceId);
      expect(foundResource.name).toEqual(resourceToSave.name);
    });

    it('should throw a NotFoundException if the resource does not exist', async () => {
      const nonExistentId = 9999;
      await expect(
        resourceRepository.findById(nonExistentId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('listAll', () => {
    it('should return an array of all resources', async () => {
      const allResources = await resourceRepository.listAll();

      expect(Array.isArray(allResources)).toBe(true);
      expect(allResources).toHaveLength(1);
      expect(allResources[0].id).toEqual(savedResourceId);
      expect(allResources[0]).toBeInstanceOf(Resource);
    });
  });

  describe('save', () => {
    it('should successfully save a new resource', async () => {
      const newResource = new Resource({
        name: 'Conference Room B',
        capacity: 25,
        timezone: 'Europe/Amsterdam',
      });

      await resourceRepository.save(newResource);

      const allResources = await resourceRepository.listAll();
      expect(allResources).toHaveLength(2); // The original + the new one
    });
  });
});