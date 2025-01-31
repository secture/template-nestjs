import { ClassProvider } from '@nestjs/common';
import { RefreshTokenMikroOrmRepository } from './infrastructure/repositories/refresh-token.mikro-orm-repository';
import { ResortMikroOrmRepository } from './infrastructure/repositories/resort.mikro-orm-repository';
import { UserMikroOrmRepository } from './infrastructure/repositories/user.mikro-orm-repository';

const userRepository: ClassProvider = {
  provide: 'UserRepository',
  useClass: UserMikroOrmRepository,
};

const refreshTokenRepository: ClassProvider = {
  provide: 'RefreshTokenRepository',
  useClass: RefreshTokenMikroOrmRepository,
};

const resortRepository: ClassProvider = {
  provide: 'ResortRepository',
  useClass: ResortMikroOrmRepository,
};

export default [userRepository, refreshTokenRepository, resortRepository];
