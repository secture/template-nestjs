import { EntityManager } from '@mikro-orm/core';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../domain/auth.service';
import { User } from '../../../shared/domain/entities/user.entity';
import { AuthHttpResponse } from '../dto/response/auth.http-response';

@ApiTags('Test')
@Controller('auth')
export class TestController {
  constructor(
    private readonly authService: AuthService,
    private readonly em: EntityManager,
  ) {}

  @Get('test')
  async test() {
    const user = User.create('test', 'user', 'test@example.org');
    await this.em.persistAndFlush(user);

    const accessToken = await this.authService.generateJwt(user);
    const refreshToken = await this.authService.generateRefreshToken(
      user,
      'default_device',
    );

    return new AuthHttpResponse(accessToken, refreshToken.token);
  }
}
