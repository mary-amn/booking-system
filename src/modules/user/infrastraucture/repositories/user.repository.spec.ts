import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserRepository } from './user.repository';
import { User } from '../../domain/entities/user.entity';
import { UserOrmEntity } from '../persistence/user-orm.entity';

describe('UserRepository (Integration with PostgreSQL)', () => {
  jest.setTimeout(30000);

  let userRepository: UserRepository;
  let dataSource: DataSource;
  let savedUserId: number;

  // --- Test Data ---
  const userToSave = User.create('test@example.com', 'Test User');

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
          entities: [UserOrmEntity], // Register the UserOrmEntity
          synchronize: true,
        }),
        TypeOrmModule.forFeature([UserOrmEntity]),
      ],
      providers: [UserRepository],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    dataSource = module.get<DataSource>(DataSource);
  });

  // 2. CLEANUP: Clear the user table and re-seed it before each test.
  beforeEach(async () => {
    const repo = dataSource.getRepository(UserOrmEntity);
    await repo.clear();
    // Save a user and capture its ID for other tests
    const savedOrmEntity = await repo.save(userToSave);
    savedUserId = savedOrmEntity.id;
  });

  // 3. TEARDOWN: Close the connection after all tests.
  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('findById', () => {
    it('should find and return a user by their ID', async () => {
      const foundUser = await userRepository.findById(savedUserId);

      expect(foundUser).toBeInstanceOf(User);
      expect(foundUser!.id).toEqual(savedUserId);
      expect(foundUser!.email).toEqual(userToSave.email);
    });

    it('should return null if the user does not exist', async () => {
      const nonExistentId = 9999;
      const foundUser = await userRepository.findById(nonExistentId);
      expect(foundUser).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find and return a user by their email address', async () => {
      const foundUser = await userRepository.findByEmail('test@example.com');

      expect(foundUser).toBeInstanceOf(User);
      expect(foundUser!.id).toEqual(savedUserId);
      expect(foundUser!.email).toEqual('test@example.com');
    });

    it('should return null if no user with the email exists', async () => {
      const foundUser = await userRepository.findByEmail(
        'nonexistent@example.com',
      );
      expect(foundUser).toBeNull();
    });
  });

  describe('save', () => {
    it('should successfully save a new user', async () => {
      // Arrange: Create a new user domain entity
      const newUser = User.create('new.user@example.com', 'New User');

      // Act: Save the new user
      await userRepository.save(newUser);

      // Assert: Verify it was saved by trying to find it by its email
      const foundUser = await userRepository.findByEmail('new.user@example.com');
      expect(foundUser).not.toBeNull();
      expect(foundUser!.name).toEqual('New User');
    });
  });
});
