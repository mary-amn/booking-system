import { Email } from '../value-object/email.vo';

export class User {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }

  static create(email: string, name: string): User {
    return new User({
      email: email,
      name: name,
    });
  }

  changeName(name: string) {
    if (!name.trim()) throw new Error('Name cannot be empty');
    this.name = name;
    this.touch();
  }

  changeEmail(email: Email) {
    this.email = email.value;
    this.touch();
  }

  private touch() {
    this.updatedAt = new Date();
  }
}
