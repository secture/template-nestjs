import { EleveError } from './eleve.error';

export class UnauthorizedError extends EleveError {
  constructor(message = 'Unauthorized') {
    super(message, 'UnauthorizedError');
  }
}
