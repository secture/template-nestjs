import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class UserMikroOrmRepository implements UserRepository {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async save(user: User): Promise<void> {
    // Implement the save logic here (e.g., MikroORM logic)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findById(id: string): Promise<User | null> {
    // Implement the find logic here
    return null;
  }
}
