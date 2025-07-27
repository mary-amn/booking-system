import {BookingStatus} from "../../../infrastraucture/booking-status.enum";

export class BookingHistoryEvent {
  constructor(
    public readonly bookingId: number,
    public readonly resourceId: number,
    public readonly confirmedByUserId: number, // Example of extra data
    public readonly eventType: BookingStatus,
  ) {}
}