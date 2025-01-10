export class ResortService {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _icon: string;

  private constructor(id: string, name: string, icon: string) {
    if (!name.trim()) {
      throw new Error('Service name cannot be empty.');
    }
    //if (!this.isValidIcon(icon)) {
    //  throw new Error(
    //    'Invalid icon. The icon must be a non-empty string and represent a valid URL.',
    //  );
    //}

    this._id = id;
    this._name = name;
    this._icon = icon;
  }

  static create(id: string, name: string, icon: string): ResortService {
    return new ResortService(id, name, icon);
  }

  static from(data: { id: string; name: string; icon: string }): ResortService {
    return new ResortService(data.id, data.name, data.icon);
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get icon(): string {
    return this._icon;
  }

  toString(): string {
    return `Resort Service: ${this._name} (ID: ${this._id}, Icon: ${this._icon})`;
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      icon: this._icon,
    };
  }

  equals(other: ResortService): boolean {
    return (
      this._id === other.id &&
      this._name === other.name &&
      this._icon === other.icon
    );
  }

  private isValidIcon(icon: string): boolean {
    return /^https?:\/\/[^\s$.?#].[^\s]*$/.test(icon);
  }
}
