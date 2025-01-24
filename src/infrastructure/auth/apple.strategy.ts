import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-apple';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly logService: LoggingService,
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('APPLE_CLIENT_ID'),
      teamID: configService.get<string>('APPLE_TEAM_ID'),
      keyID: configService.get<string>('APPLE_KEY_ID'),
      privateKeyString: configService
        .get<string>('APPLE_PRIVATE_KEY')!
        .replace(/\\n/g, '\n'),
      callbackURL: configService.get<string>('APPLE_CALLBACK_URL'),
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const idToken = req.body.id_token;
    this.logService.debug(idToken, 'AppleStrategy idToken');

    const userInfo = req.body.user ? JSON.parse(req.body.user) : undefined;
    this.logService.debug(
      JSON.stringify(userInfo, null, 2),
      'AppleStrategy userInfo',
    );

    try {
      const decodedIdToken = await this.jwtService.decode(idToken);
      this.logService.debug(
        JSON.stringify(decodedIdToken, null, 2),
        'AppleStrategy decodedIdToken',
      );

      const user = await this.validateOrCreateUser(
        userInfo?.name.firstName,
        userInfo?.name.lastName,
        decodedIdToken.email,
        decodedIdToken.sub,
      );
      this.logService.debug(
        JSON.stringify(user, null, 2),
        'AppleStrategy user',
      );

      done(null, user);
    } catch (error) {
      this.logService.error(error.message, 'AppleStrategy error');
      done(error, undefined);
    }
  }

  private async validateOrCreateUser(
    name: string,
    surname: string,
    email: string,
    appleId: string,
  ): Promise<User> {
    let user = await this.userRepository.findByEmail(email);
    if (!user) {
      user = User.createAppleUser(name, surname, email, appleId);

      await this.userRepository.save(user);
    }

    return user;
  }
}
