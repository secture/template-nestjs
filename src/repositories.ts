import { ClassProvider } from '@nestjs/common';
import { RefreshTokenMikroOrmRepository } from './infrastructure/repositories/refresh-token.mikro-orm-repository';
import { UserMikroOrmRepository } from './infrastructure/repositories/user.mikro-orm-repository';

const userRepository: ClassProvider = {
  provide: 'UserRepository',
  useClass: UserMikroOrmRepository,
};

const refreshTokenRepository: ClassProvider = {
  provide: 'RefreshTokenRepository',
  useClass: RefreshTokenMikroOrmRepository,
};

export default [userRepository, refreshTokenRepository];
