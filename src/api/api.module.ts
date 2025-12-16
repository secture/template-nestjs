import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import controllers from './controllers';
import handles from './handles';

@Module({
  imports: [TerminusModule],
  controllers: controllers,
  providers: [...handles],
})
export class ApiModule {}
