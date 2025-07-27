export class GetAvailableResourcesQuery {
  constructor(
    public readonly startTime: Date,
    public readonly endTime: Date,
  ) {}
}