import { NotFoundError } from './not-found.error';

export class UserNotFoundError extends NotFoundError {
  constructor() {
    super('user.not_found');
  }
}
