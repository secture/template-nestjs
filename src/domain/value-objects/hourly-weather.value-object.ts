export class HourlyWeather {
  private readonly _hour: string;
  private readonly _temperature: number;
  private readonly _conditions: string;

  private constructor(hour: string, temperature: number, conditions: string) {
    if (!this.isValidHour(hour)) {
      throw new Error('Invalid hour format. Please provide a valid hour.');
    }
    if (temperature < -100 || temperature > 100) {
      throw new Error('Temperature out of realistic range.');
    }
    if (!conditions.trim()) {
      throw new Error('Conditions cannot be empty.');
    }

    this._hour = hour;
    this._temperature = temperature;
    this._conditions = conditions;
  }

  static create(
    hour: string,
    temperature: number,
    conditions: string,
  ): HourlyWeather {
    return new HourlyWeather(hour, temperature, conditions);
  }

  static from(data: {
    hour: string;
    temperature: number;
    conditions: string;
  }): HourlyWeather {
    return new HourlyWeather(data.hour, data.temperature, data.conditions);
  }

  get hour(): string {
    return this._hour;
  }

  get temperature(): number {
    return this._temperature;
  }

  get conditions(): string {
    return this._conditions;
  }

  toString(): string {
    return `Hour: ${this._hour}, Temperature: ${this._temperature}°C, Conditions: ${this._conditions}`;
  }

  toJSON() {
    return {
      hour: this._hour,
      temperature: this._temperature,
      conditions: this._conditions,
    };
  }

  equals(other: HourlyWeather): boolean {
    return (
      this._hour === other.hour &&
      this._temperature === other.temperature &&
      this._conditions === other.conditions
    );
  }

  private isValidHour(hour: string): boolean {
    const hourRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return hourRegex.test(hour);
  }
}
