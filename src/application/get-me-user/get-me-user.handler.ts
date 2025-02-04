import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { GetMeQuery } from './get-me-user.query';
import { User } from '../../domain/entities/user.entity';
import { UserNotFoundError } from '../../domain/error/user-not-found.error';

@Injectable()
export class GetMeHandler {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async handler(query: GetMeQuery): Promise<User> {
    const { userId } = query;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }
}
