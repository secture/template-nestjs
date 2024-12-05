import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetAppVersionsHandler } from './application/get-app-versions/get-app-versions.handler';

const getAppVersionsHandler: FactoryProvider = {
  provide: GetAppVersionsHandler,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return new GetAppVersionsHandler(
      configService.getOrThrow('MIN_SUPPORTED_VERSION'),
      configService.getOrThrow('RECOMMENDED_VERSION'),
    );
  },
};

export default [getAppVersionsHandler];
