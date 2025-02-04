import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Id } from '../value-objects/id.value-object';

@Entity()
export class User {
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  private readonly _id!: string;

  @Property({ type: 'Date', fieldName: 'created_at' })
  private readonly _createdAt!: Date;

  @Property({
    type: 'Date',
    onUpdate: () => new Date(),
    fieldName: 'updated_at',
  })
  private _updatedAt: Date;

  @Property({ type: 'string', fieldName: 'name' })
  private readonly _name!: string;

  @Property({ type: 'string', fieldName: 'surname' })
  private readonly _surname!: string;

  @Property({ type: 'string', fieldName: 'email' })
  private readonly _email!: string;

  @Property({ nullable: true })
  private readonly _appleId?: string;

  @Property({ nullable: true, type: 'string', fieldName: 'phone' })
  private _phone?: string;

  @Property({ type: 'boolean', fieldName: 'phone_verified', default: false })
  private readonly _phoneVerified: boolean;

  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    name: string,
    surname: string,
    email: string,
    phone?: string,
    appleId?: string,
  ) {
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._name = name;
    this._surname = surname;
    this._email = email;
    this._appleId = appleId;
    this._phone = phone;
    this._phoneVerified = false;
  }

  static create(name: string, surname: string, email: string): User {
    const id = Id.generate().toString();
    const createdAt = new Date();

    return new User(id, createdAt, createdAt, name, surname, email);
  }

  static createAppleUser(
    name: string,
    surname: string,
    email: string,
    appleId: string,
  ): User {
    const id = Id.generate().toString();
    const createdAt = new Date();

    return new User(
      id,
      createdAt,
      createdAt,
      name,
      surname,
      email,
      undefined,
      appleId,
    );
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get surname(): string {
    return this._surname;
  }

  get email(): string {
    return this._email;
  }

  get phone(): string | undefined {
    return this._phone;
  }

  set phone(phoneNumber: string) {
    this._phone = phoneNumber;
  }

  get phoneVerified(): boolean {
    return this._phoneVerified;
  }
}
