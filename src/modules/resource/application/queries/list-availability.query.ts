export class ListAvailabilityQuery {
  constructor(
    public readonly resourceId: string,
    public readonly from: Date,
    public readonly to: Date,
  ) {}
}
