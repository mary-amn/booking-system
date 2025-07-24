import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking } from '../../domain/entities/booking.entity';
import { BookingOrmEntity } from '../persistence/booking-orm.entity';


@Injectable()
export class BookingRepository {
  constructor(
    @InjectRepository(BookingOrmEntity)
    private readonly repo: Repository<BookingOrmEntity>,
  ) {}
  private toDomain(orm: BookingOrmEntity): Booking {
    return Booking.create(
      orm.resourceId,
      orm.userId,
      orm.startsAt,
      orm.endsAt,
      orm.status,
    );
  }

  /** Convert Domain → ORM */
  private toOrmEntity(domain: Booking): BookingOrmEntity {
    const orm = new BookingOrmEntity();
    orm.id = domain.id;
    orm.userId = domain.userId;
    orm.resourceId = domain.resourceId;
    orm.startsAt = domain.startsAt;
    orm.endsAt = domain.endsAt;
    orm.status = domain.status;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    return orm;
  }
  async save(booking: Booking): Promise<void> {
    const orm = this.toOrmEntity(booking);
    await this.repo.save(orm);
  }

  async findById(id: string): Promise<Booking | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findByUser(userId: string): Promise<Booking[]> {
    const rows = await this.repo.find({ where: { userId } });
    return rows.map((x) => this.toDomain(x));
  }

  async findByResource(
    resourceId: string,
    from: Date,
    to: Date,
  ): Promise<Booking[]> {
    const rows = await this.repo.find({
      where: {
        resourceId,
        startsAt: Between(from, to),
      },
    });
    return rows.map((x) => this.toDomain(x));
  }


}
