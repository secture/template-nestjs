export class Collection<T> {
  private readonly _items: readonly T[];

  private constructor(items: T[]) {
    this._items = Object.freeze([...items]);
  }

  static create<T>(items: T[]): Collection<T> {
    return new Collection<T>(items);
  }

  static from<T>(items: T[]): Collection<T> {
    return new Collection<T>(items);
  }

  get items(): readonly T[] {
    return [...this._items];
  }

  length(): number {
    return this._items.length;
  }

  includes(item: T): boolean {
    return this._items.includes(item);
  }

  add(item: T): Collection<T> {
    return new Collection<T>([...this._items, item]);
  }

  remove(item: T): Collection<T> {
    return new Collection<T>(
      this._items.filter((existingItem) => existingItem !== item),
    );
  }

  filter(predicate: (item: T) => boolean): Collection<T> {
    return new Collection<T>(this._items.filter(predicate));
  }

  map<R>(mapper: (item: T) => R): Collection<R> {
    return new Collection<R>(this._items.map(mapper));
  }

  forEach(action: (item: T) => void): void {
    this._items.forEach(action);
  }

  toJSON() {
    return this._items.map((item) =>
      typeof (item as any).toJSON === 'function'
        ? (item as any).toJSON()
        : item,
    );
  }
}
