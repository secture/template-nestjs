import { v4 as uuid, validate as uuidValidate } from 'uuid';

export class Id {
  private readonly _value: string;

  private constructor(value: string) {
    if (!uuidValidate(value)) {
      throw new Error('Invalid UUID format');
    }
    this._value = value;
  }

  static generate(): Id {
    return new Id(uuid());
  }

  static from(value: string): Id {
    return new Id(value);
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }

  equals(other: Id): boolean {
    return this._value === other.toString();
  }
}
