import { EleveError } from './eleve.error';

export class ConflictError extends EleveError {
  constructor(message = 'Conflict') {
    super(message, 'ConflictError');
  }
}
