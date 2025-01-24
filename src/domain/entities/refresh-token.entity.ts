import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Id } from '../value-objects/id.value-object';
import { User } from './user.entity';

@Entity()
export class RefreshToken {
  @PrimaryKey({ type: 'uuid', fieldName: 'id' })
  private readonly _id!: string;

  @ManyToOne(() => User, { fieldName: 'user_id' })
  private readonly _user!: User;

  @Property({ type: 'string', fieldName: 'token' })
  private readonly _token!: string;

  @Property({ type: 'Date', fieldName: 'created_at' })
  private readonly _createdAt!: Date;

  @Property({
    type: 'Date',
    onUpdate: () => new Date(),
    fieldName: 'updated_at',
  })
  private _updatedAt!: Date;

  @Property({ type: 'Date', fieldName: 'expires_at' })
  private readonly _expiresAt!: Date;

  @Property({ type: 'boolean', default: false, fieldName: 'is_revoked' })
  private _isRevoked: boolean;

  @Property({ type: 'string', fieldName: 'device_info' })
  private readonly _deviceInfo!: string;

  constructor(
    id: string,
    user: User,
    token: string,
    createdAt: Date,
    updatedAt: Date,
    expiresAt: Date,
    deviceInfo: string,
    isRevoked: boolean,
  ) {
    this._id = id;
    this._user = user;
    this._token = token;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._expiresAt = expiresAt;
    this._deviceInfo = deviceInfo;
    this._isRevoked = isRevoked;
  }

  static create(
    user: User,
    token: string,
    expiresAt: Date,
    deviceInfo: string,
  ): RefreshToken {
    const id = Id.generate().toString();
    const createdAt = new Date();

    return new RefreshToken(
      id,
      user,
      token,
      createdAt,
      createdAt,
      expiresAt,
      deviceInfo,
      false,
    );
  }

  get userId(): string {
    return this._user.id;
  }

  get user(): User {
    return this._user;
  }

  get token(): string {
    return this._token;
  }

  get expiresAt(): Date {
    return this._expiresAt;
  }

  get isRevoked(): boolean {
    return this._isRevoked;
  }

  revoke() {
    this._isRevoked = true;

    return this;
  }
}
