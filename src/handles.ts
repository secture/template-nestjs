import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthUserHandler } from './application/auth-user/auth-user.handler';
import { GetAppVersionsHandler } from './application/get-app-versions/get-app-versions.handler';
import { GetResortsHandler } from './application/get-resorts/get-resorts.handler';
import { RefreshAccessTokenHandler } from './application/refresh-access-token/refresh-access-token.handler';
import { RevokeRefreshTokenHandler } from './application/revoke-refresh-token/revoke-refresh-token.handler';

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

export default [
  getAppVersionsHandler,
  AuthUserHandler,
  RefreshAccessTokenHandler,
  RevokeRefreshTokenHandler,
  GetResortsHandler,
];
