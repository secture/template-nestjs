import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { Id } from '../value-objects/id.value-object';

@Entity()
export class User {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier',
  })
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  private readonly _id!: Id;

  @Property({ type: 'Date', fieldName: 'created_at' })
  private readonly _createdAt!: Date;

  @Property({
    type: 'Date',
    onUpdate: () => new Date(),
    fieldName: 'updated_at',
  })
  private _updatedAt: Date;

  @ApiProperty({ example: 'John', description: 'Name of the user' })
  @Property({ type: 'string', fieldName: 'name' })
  private readonly _name!: string;

  @ApiProperty({ example: 'Doe', description: 'Surname of the user' })
  @Property({ type: 'string', fieldName: 'surname' })
  private readonly _surname!: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @Property({ type: 'string', fieldName: 'email' })
  private readonly _email!: string;

  constructor(
    id: Id,
    createdAt: Date,
    updatedAt: Date,
    name: string,
    surname: string,
    email: string,
  ) {
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._name = name;
    this._surname = surname;
    this._email = email;
  }

  static create(name: string, surname: string, email: string): User {
    const id = Id.generate();
    const createdAt = new Date();

    return new User(id, createdAt, createdAt, name, surname, email);
  }
}
