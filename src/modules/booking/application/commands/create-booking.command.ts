export class CreateBookingCommand {
  constructor(
    public readonly userId: string,
    public readonly resourceId: string,
    public readonly startsAt: Date,
    public readonly endsAt: Date,
  ) {}
}
