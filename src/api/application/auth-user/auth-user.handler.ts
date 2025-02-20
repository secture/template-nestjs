import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../../domain/auth.service';
import { UserNotFoundError } from '../../domain/error/user-not-found.error';
import { UserRepository } from '../../domain/repositories/user.repository';
import { AuthUserCommand } from './auth-user.command';
import { AuthUserDto } from './auth-user.dto';

@Injectable()
export class AuthUserHandler {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}
  async handle(command: AuthUserCommand): Promise<AuthUserDto> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const accessToken = await this.authService.generateJwt(user);
    const refreshToken = await this.authService.generateRefreshToken(
      user,
      'default_device',
    );

    return new AuthUserDto(accessToken, refreshToken);
  }
}
