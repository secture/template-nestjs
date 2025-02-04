import { ClassProvider } from '@nestjs/common';
import { UserRepository } from './domain/repositories/user.repository';
import { RefreshTokenMikroOrmRepository } from './infrastructure/repositories/refresh-token.mikro-orm-repository';
import { ResortMikroOrmRepository } from './infrastructure/repositories/resort.mikro-orm-repository';
import { UserMikroOrmRepository } from './infrastructure/repositories/user.mikro-orm-repository';

const userRepository: ClassProvider<UserRepository> = {
  provide: 'UserRepository',
  useClass: UserMikroOrmRepository,
};

const refreshTokenRepository: ClassProvider<RefreshTokenMikroOrmRepository> = {
  provide: 'RefreshTokenRepository',
  useClass: RefreshTokenMikroOrmRepository,
};

const resortRepository: ClassProvider<ResortMikroOrmRepository> = {
  provide: 'ResortRepository',
  useClass: ResortMikroOrmRepository,
};

export default [userRepository, refreshTokenRepository, resortRepository];
