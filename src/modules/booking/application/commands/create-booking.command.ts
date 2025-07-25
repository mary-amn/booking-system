export class CreateBookingCommand {
  constructor(
    public readonly userId: number,
    public readonly resourceId: number,
    public readonly startsAt: Date,
    public readonly endsAt: Date,
  ) {}
}
