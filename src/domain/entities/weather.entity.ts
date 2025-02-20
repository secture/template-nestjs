import {
  DateTimeType,
  DateType,
  Entity,
  JsonType,
  OneToOne,
  PrimaryKey,
  Property,
  UuidType,
} from '@mikro-orm/core';
import { HourlyWeather } from '../value-objects/hourly-weather.value-object';
import { WeeklyWeather } from '../value-objects/weekly-weather.value-object';
import { Resort } from './resort.entity';

@Entity()
export class Weather {
  @PrimaryKey({ type: UuidType, fieldName: 'id' })
  private readonly _id!: string;

  @Property({ type: DateTimeType, fieldName: 'created_at' })
  private readonly _createdAt!: Date;

  @Property({
    type: DateTimeType,
    onUpdate: () => new Date(),
    fieldName: 'updated_at',
  })
  private _updatedAt!: Date;

  @OneToOne(() => Resort, { fieldName: 'resort_id' })
  private readonly _resort!: Resort;

  @Property({ type: DateType, fieldName: 'day' })
  private readonly _day!: Date;

  @Property({ type: JsonType, fieldName: 'today' })
  private readonly _today!: HourlyWeather[];

  @Property({ type: JsonType, fieldName: 'weekly' })
  private readonly _weekly!: WeeklyWeather[];

  private constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    resort: Resort,
    day: Date,
    today: HourlyWeather[],
    weekly: WeeklyWeather[],
  ) {
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._resort = resort;
    this._day = day;
    this._today = today;
    this._weekly = weekly;
  }

  static create(
    id: string,
    resort: Resort,
    day: Date,
    today: HourlyWeather[],
    weekly: WeeklyWeather[],
  ): Weather {
    const createdAt = new Date();

    return new Weather(id, createdAt, createdAt, resort, day, today, weekly);
  }

  get id(): string {
    return this._id;
  }

  get resort(): Resort {
    return this._resort;
  }
}
