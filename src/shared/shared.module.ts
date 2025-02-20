import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './infrastructure/auth/jwt.strategy';
import { LoggingService } from './infrastructure/logging/logging.service';

const jwtModule = JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: process.env.JWT_TTL },
});

@Global()
@Module({
  imports: [jwtModule],
  providers: [LoggingService, JwtStrategy],
  exports: [LoggingService, jwtModule],
})
export class SharedModule {}
