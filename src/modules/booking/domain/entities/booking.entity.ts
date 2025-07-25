import { BookingStatus } from '../../infrastraucture/booking-status.enum';

export class Booking {
  id: number;
  resourceId: number;
  userId: number;
  startsAt: Date;
  endsAt: Date;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
  deleted_at?: Date;

  constructor(init?: Partial<Booking>) {
    Object.assign(this, init);
    // ensure timestamps exist
    this.createdAt = this.createdAt ?? new Date();
    this.updatedAt = this.updatedAt ?? new Date();
  }

  /** Factory: default status to PENDING if not provided */
  static create(
    resourceId: number,
    userId: number,
    startsAt: Date,
    endsAt: Date,
    status: BookingStatus = BookingStatus.PENDING,
  ): Booking {
    return new Booking({
      resourceId,
      userId,
      startsAt,
      endsAt,
      status,
    });
  }

  /** Confirm only if pending */
  confirm(): void {
    if (this.status !== BookingStatus.PENDING) {
      throw new Error('Only pending bookings can be confirmed');
    }
    this.status = BookingStatus.CONFIRMED;
    this.touch();
  }

  /** Cancel (idempotent) */
  cancel(): void {
    if (this.status === BookingStatus.CANCELLED) {
      return;
    }
    this.status = BookingStatus.CANCELLED;
    this.touch();
  }

  /** Does this booking overlap another timeslot? */
  overlaps(other: { startsAt: Date; endsAt: Date }): boolean {
    return this.startsAt < other.endsAt && other.startsAt < this.endsAt;
  }

  /** Update the `updatedAt` timestamp */
  private touch(): void {
    this.updatedAt = new Date();
  }
}
