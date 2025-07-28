import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BookingStatus } from '../booking-status.enum';

@Entity('booking_history')
export class BookingHistoryOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar' })
  bookingId: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
  })
  eventType: BookingStatus;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ type: 'jsonb', nullable: true })
  details: Record<string, any>;
}
