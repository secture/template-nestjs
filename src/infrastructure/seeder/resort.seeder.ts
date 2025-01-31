import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import dayjs from 'dayjs';
import { News } from '../../domain/entities/news.entity';
import { Resort } from '../../domain/entities/resort.entity';
import { Weather } from '../../domain/entities/weather.entity';
import { Webcam } from '../../domain/entities/webcam.entity';
import { Collection } from '../../domain/value-objects/collection.value-object';
import { GeoPoint } from '../../domain/value-objects/geo-point.value-object';
import { HourlyWeather } from '../../domain/value-objects/hourly-weather.value-object';
import { Id } from '../../domain/value-objects/id.value-object';
import { ResortContact } from '../../domain/value-objects/resort-contact.value-object';
import { ResortService } from '../../domain/value-objects/resort-service.value-object';
import { WeeklyWeather } from '../../domain/value-objects/weekly-weather.value-object';

export class ResortSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const fs = await import('fs/promises');
    const path = await import('path');
    const filePath = path.resolve(__dirname, 'data', 'resort.json');
    const fileData = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileData);

    for (const resortData of data) {
      const existingResort = await em.findOne(Resort, { id: resortData.id });
      if (existingResort) {
        continue;
      }

      const resort = this.parseResort(resortData);
      em.persist(resort);

      const webcams = resortData.webcams.map((webcamData: any) => {
        return Webcam.create(
          Id.from(webcamData.id).toString(),
          webcamData.name,
          webcamData.url,
          resort,
          dayjs(webcamData.lastUpdated).toDate(),
        );
      });
      em.persist(webcams);

      const news = resortData.news.map((newsData: any) => {
        return News.create(
          Id.from(newsData.id).toString(),
          newsData.title,
          newsData.description,
          newsData.url,
          dayjs(newsData.date).toDate(),
          resort,
        );
      });
      em.persist(news);

      const weatherData = resortData.weather;
      const weather = Weather.create(
        Id.generate().toString(),
        resort,
        new Date(),
        weatherData.today.hourly.map((hourData: any) => {
          return HourlyWeather.create(
            hourData.hour,
            hourData.temperature,
            hourData.conditions,
          );
        }),
        weatherData.weekly.map((dayData: any) => {
          return WeeklyWeather.create(
            dayData.day,
            dayData.temperature,
            dayData.snowDepth,
            dayData.windSpeed,
          );
        }),
      );
      em.persist(weather);

      await em.flush();
    }
  }

  private parseResort(resortData: any) {
    return Resort.create(
      Id.from(resortData.id).toString(),
      resortData.name,
      resortData.logo,
      resortData.technicalData.kilometersOfTracks,
      resortData.technicalData.numberOfLifts,
      resortData.technicalData.numberOfTracks,
      resortData.description,
      GeoPoint.from(resortData.location),
      resortData.country,
      resortData.images,
      Collection.create<ResortContact>(
        resortData.contacts.map((contactData: object) =>
          ResortContact.create(
            Object.keys(contactData)[1],
            Object.values(contactData)[0],
            Object.values(contactData)[1].replace(/ /g, ''),
          ),
        ),
      ),
      Collection.create<ResortService>(
        resortData.services.map(
          (serviceData: { id: string; name: string; icon: string }) =>
            ResortService.create(
              serviceData.id,
              serviceData.name,
              serviceData.icon,
            ),
        ),
      ),
    );
  }
}
