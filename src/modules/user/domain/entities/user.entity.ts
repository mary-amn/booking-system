
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


  private touch() {
    this.updatedAt = new Date();
  }
}
