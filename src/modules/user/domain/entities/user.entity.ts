export class User {
  id: string;
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
}
