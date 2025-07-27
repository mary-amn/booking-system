import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { BookingStatus } from '../booking-status.enum';

@Entity('bookings')
@Index(['resourceId', 'startsAt', 'endsAt'])
export class BookingOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column('bigint')
  resourceId: number;
  @Column('bigint')
  userId: number;

  @Column('datetime')
  startsAt: Date;
  @Column('datetime')
  endsAt: Date;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
