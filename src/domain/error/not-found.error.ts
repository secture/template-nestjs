import { EleveError } from './eleve.error';

export class NotFoundError extends EleveError {
  constructor(message = 'Not found') {
    super(message, 'NotFoundError');
  }
}
