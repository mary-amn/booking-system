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
    this.createdAt = this.createdAt ?? new Date();
    this.updatedAt = this.updatedAt ?? new Date();
  }

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

  confirm(): void {
    if (this.status !== BookingStatus.PENDING) {
      throw new Error('Only pending bookings can be confirmed');
    }
    this.status = BookingStatus.CONFIRMED;
    this.touch();
  }

  cancel(): void {
    if (this.status === BookingStatus.CANCELLED) {
      return;
    }
    this.status = BookingStatus.CANCELLED;
    this.touch();
  }


  private touch(): void {
    this.updatedAt = new Date();
  }
}
