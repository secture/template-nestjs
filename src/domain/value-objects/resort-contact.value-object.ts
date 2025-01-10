export class ResortContact {
  private readonly _type: string;
  private readonly _name: string;
  private readonly _value: string;

  private constructor(type: string, name: string, value: string) {
    if (!this.isValidType(type)) {
      throw new Error(
        'Invalid contact type. Accepted types: phone, email, url.',
      );
    }
    if (!this.isValidValue(type, value)) {
      throw new Error(`Invalid value for contact type: ${type}`);
    }

    this._type = type;
    this._name = name;
    this._value = value;
  }

  static create(type: string, name: string, value: string): ResortContact {
    return new ResortContact(type, name, value);
  }

  static from(data: {
    type: string;
    name: string;
    value: string;
  }): ResortContact {
    return new ResortContact(data.type, data.name, data.value);
  }

  get type(): string {
    return this._type;
  }

  get name(): string {
    return this._name;
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return `${this._name} - ${this._type}: ${this._value}`;
  }

  toJSON() {
    return {
      name: this._name,
      type: this._type,
      value: this._value,
    };
  }

  equals(other: ResortContact): boolean {
    return (
      this._type === other.type &&
      this._name === other.name &&
      this._value === other.value
    );
  }

  private isValidType(type: string): boolean {
    const validTypes = ['phone', 'email', 'url'];
    return validTypes.includes(type);
  }

  private isValidValue(type: string, value: string): boolean {
    switch (type) {
      case 'phone':
        return /^\+?[1-9]\d{1,14}$/.test(value);
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'url':
        return /^https?:\/\/[^\s$.?#].[^\s]*$/.test(value);
      default:
        return false;
    }
  }
}
