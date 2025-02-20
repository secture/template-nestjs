import { User } from '../../../shared/domain/entities/user.entity';

export interface UserRepository {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(userId: string): Promise<User | null>;
}
