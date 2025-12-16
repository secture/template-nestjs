import { Global, Module } from '@nestjs/common';
import { LoggingService } from './infrastructure/logging/logging.service';

@Global()
@Module({
  providers: [LoggingService],
  exports: [LoggingService],
})
export class SharedModule {}
