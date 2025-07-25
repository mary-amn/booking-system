// src/modules/scheduling/domain/value-objects/timeslot.vo.ts

export class TimeSlot {
  private constructor(
    public readonly start: Date,
    public readonly end: Date,
  ) {}

  /**
   * Factory to enforce start < end.
   * @throws Error if start >= end
   */
  static create(start: Date, end: Date): TimeSlot {
    if (start >= end) {
      throw new Error('TimeSlot validation failed: start must be before end');
    }
    return new TimeSlot(start, end);
  }

  /**
   * Check if this slot overlaps another.
   */
  overlaps(other: TimeSlot): boolean {
    return this.start < other.end && other.start < this.end;
  }

  /**
   * Optionally, check containment: this fully contains the other slot.
   */
  contains(other: TimeSlot): boolean {
    return this.start <= other.start && this.end >= other.end;
  }

  /**
   * Returns a string representation for logging or debugging.
   */
  toString(): string {
    return `${this.start.toISOString()} → ${this.end.toISOString()}`;
  }
}
