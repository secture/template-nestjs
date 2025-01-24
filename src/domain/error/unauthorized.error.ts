import { EleveError } from './eleve.error';

export class UnauthorizedError extends EleveError {
  constructor(message = 'eleve.unauthorized') {
    super(message, 'UnauthorizedError');
  }
}
