import {
  Column,
  CreateDateColumn, DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('resources')
export class ResourceOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: string;
  @Column('text')
  name: string;
  @Column('int', { default: 1 })
  capacity: number; // >1 means parallel bookings allowed
  @Column({ type: 'text', default: 'UTC' })
  timezone!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
