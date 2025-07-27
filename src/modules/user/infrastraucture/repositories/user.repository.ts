import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from '../persistence/user-orm.entity';
import { User } from '../../domain/entities/user.entity';
import { Booking } from '../../../booking/domain/entities/booking.entity';

// (Optional) Define an interface in domain:
// export interface IUserRepository { save(u: User): Promise<void>; findById(id: string): Promise<User|null>; findByEmail(email: string): Promise<User|null>; }

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  private toDomain(orm: UserOrmEntity): User {
    const user = new User({
      id: orm.id,
      name: orm.name,
      email: orm.email,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
    return user;
  }

  private toOrm(user: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.id = user.id;
    orm.name = user.name;
    orm.email = user.email;
    orm.createdAt = user.createdAt;
    orm.updatedAt = user.updatedAt;
    return orm;
  }

  async save(user: User): Promise<number> {
    const orm = this.toOrm(user);
    await this.repo.save(orm);
    return orm.id;
  }

  async findById(id: number): Promise<User | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const orm = await this.repo.findOne({ where: { email } });
    return orm ? this.toDomain(orm) : null;
  }
}
