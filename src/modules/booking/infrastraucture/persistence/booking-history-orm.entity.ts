import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BookingStatus } from '../booking-status.enum';

@Entity('booking_history')
export class BookingHistory {
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

  // A JSON column to store relevant data at the time of the event
  @Column({ type: 'jsonb', nullable: true })
  details: Record<string, any>;
}
