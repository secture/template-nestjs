import { EleveError } from './eleve.error';

export class ConflictError extends EleveError {
  constructor(message = 'eleve.conflict') {
    super(message, 'ConflictError');
  }
}
