import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import controllers from './controllers';
import handles from './handles';
import { AppleStrategy } from './infrastructure/auth/apple.strategy';
import repositories from './repositories';
import services from './services';

@Module({
  imports: [TerminusModule],
  controllers: controllers,
  providers: [AppleStrategy, ...repositories, ...services, ...handles],
})
export class ApiModule {}
