import * as process from 'node:process';
import { AppController } from './presentation/controllers/app.controller';
import { AuthController } from './presentation/controllers/auth.controller';
import { HealthController } from './presentation/controllers/health.controller';
import { GetMeController } from './presentation/controllers/me.controller';
import { ResortController } from './presentation/controllers/resort.controller';
import { TestController } from './presentation/controllers/test.controller';
import { GetWebcamsController } from './presentation/controllers/webcam.controller';

const controllers: any[] = [
  AppController,
  HealthController,
  AuthController,
  ResortController,
  GetMeController,
  GetWebcamsController,
];

if ('development' === process.env.NODE_ENV) {
  controllers.push(TestController);
}
export default controllers;
