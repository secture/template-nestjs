import { EleveError } from './eleve.error';

export class NotFoundError extends EleveError {
  constructor(message = 'eleve.not_found') {
    super(message, 'NotFoundError');
  }
}
