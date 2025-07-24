import { BookingStatus } from '../../infrastraucture/booking-status.enum';

export class Booking {
  id: string;
  resourceId: string;
  userId: string;
  startsAt: Date;
  endsAt: Date;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
  deleted_at: Date;

  constructor(init?: Partial<Booking>) {
    Object.assign(this, init);
  }

  static create(
    resourceId: string,
    userId: string,
    startsAt: Date,
    endsAt: Date,
    status: BookingStatus,
  ): Booking {
    return new Booking({
      userId: userId,
      startsAt: startsAt,
      endsAt: endsAt,
      resourceId: resourceId,
      status: status,
    });
  }
}
