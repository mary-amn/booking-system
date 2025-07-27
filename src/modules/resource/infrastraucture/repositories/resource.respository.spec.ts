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

  // 1. SETUP: Connect to the PostgreSQL test database.
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

  // 2. CLEANUP: Clear the table and re-seed it before each test.
  beforeEach(async () => {
    const repo = dataSource.getRepository(ResourceOrmEntity);
    await repo.clear();
    // Save a resource and capture its ID for other tests to use
    const savedOrmEntity = await repo.save(resourceToSave);
    savedResourceId = savedOrmEntity.id;
  });

  // 3. TEARDOWN: Close the connection after all tests.
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
      // We expect the promise to be rejected with a NotFoundException
      await expect(
        resourceRepository.findById(nonExistentId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('listAll', () => {
    it('should return an array of all resources', async () => {
      // Act: List all resources
      const allResources = await resourceRepository.listAll();

      // Assert: Check that the result is an array containing our seeded resource
      expect(Array.isArray(allResources)).toBe(true);
      expect(allResources).toHaveLength(1);
      expect(allResources[0].id).toEqual(savedResourceId);
      expect(allResources[0]).toBeInstanceOf(Resource);
    });
  });

  describe('save', () => {
    it('should successfully save a new resource', async () => {
      // Arrange: Create a new resource domain entity
      const newResource = new Resource({
        name: 'Conference Room B',
        capacity: 25,
        timezone: 'Europe/Amsterdam',
      });

      // Act: Save the new resource
      await resourceRepository.save(newResource);

      // Assert: Verify it was saved by trying to list all resources
      const allResources = await resourceRepository.listAll();
      expect(allResources).toHaveLength(2); // The original + the new one
    });
  });
});