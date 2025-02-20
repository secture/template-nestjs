export class WeeklyWeather {
  private readonly _day: string;
  private readonly _temperature: { min: number; max: number };
  private readonly _snowDepth: number;
  private readonly _windSpeed: number;

  private constructor(
    day: string,
    temperature: { min: number; max: number },
    snowDepth: number,
    windSpeed: number,
  ) {
    if (!this.isValidDay(day)) {
      throw new Error('Invalid day format. Day must be a valid weekday name.');
    }
    if (!this.isValidTemperature(temperature)) {
      throw new Error(
        'Invalid temperature range. Min cannot be greater than max.',
      );
    }
    if (0 > snowDepth) {
      throw new Error('Snow depth must be a non-negative number.');
    }
    if (0 > windSpeed) {
      throw new Error('Wind speed must be a non-negative number.');
    }

    this._day = day;
    this._temperature = temperature;
    this._snowDepth = snowDepth;
    this._windSpeed = windSpeed;
  }

  static create(
    day: string,
    temperature: { min: number; max: number },
    snowDepth: number,
    windSpeed: number,
  ): WeeklyWeather {
    return new WeeklyWeather(day, temperature, snowDepth, windSpeed);
  }

  static from(data: {
    day: string;
    temperature: { min: number; max: number };
    snowDepth: number;
    windSpeed: number;
  }): WeeklyWeather {
    return new WeeklyWeather(
      data.day,
      data.temperature,
      data.snowDepth,
      data.windSpeed,
    );
  }

  get day(): string {
    return this._day;
  }

  get temperature(): { min: number; max: number } {
    return this._temperature;
  }

  get snowDepth(): number {
    return this._snowDepth;
  }

  get windSpeed(): number {
    return this._windSpeed;
  }

  toString(): string {
    return `Day: ${this._day}, Temperature: min ${this._temperature.min}°C, max ${this._temperature.max}°C, Snow Depth: ${this._snowDepth} cm, Wind Speed: ${this._windSpeed} km/h`;
  }

  toJSON() {
    return {
      day: this._day,
      temperature: this._temperature,
      snowDepth: this._snowDepth,
      windSpeed: this._windSpeed,
    };
  }

  equals(other: WeeklyWeather): boolean {
    return (
      this._day === other.day &&
      this._temperature.min === other.temperature.min &&
      this._temperature.max === other.temperature.max &&
      this._snowDepth === other.snowDepth &&
      this._windSpeed === other.windSpeed
    );
  }

  private isValidDay(day: string): boolean {
    const validDays = [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
    ];
    return validDays.includes(day);
  }

  private isValidTemperature(temperature: {
    min: number;
    max: number;
  }): boolean {
    return temperature.min <= temperature.max;
  }
}
