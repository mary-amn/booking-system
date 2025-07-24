export class Resource {
  id: string;
  name: string;
  capacity: number; // >1 means parallel bookings allowed
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(init?: Partial<Resource>) {
    Object.assign(this, init);
  }

  static create(
    name: string,
    capacity: number, // >1 means parallel bookings allowed
    timezone: string,
  ): Resource {
    return new Resource({
      name: name,
      capacity: capacity,
      timezone: timezone,
    });
  }
}
