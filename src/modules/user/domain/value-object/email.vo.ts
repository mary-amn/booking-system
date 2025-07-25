export class Email {
  private constructor(private readonly _value: string) {}

  static create(value: string): Email {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(value)) throw new Error('Invalid email');
    return new Email(value.toLowerCase());
  }

  get value(): string {
    return this._value;
  }
}
