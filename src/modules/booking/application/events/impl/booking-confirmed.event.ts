
export class BookingConfirmedEvent {
  constructor(
    public readonly bookingId: number,
    public readonly resourceId: number,
    public readonly confirmedByUserId: number, // Example of extra data
  ) {}
}