import { EleveError } from './eleve.error';

export class InvalidError extends EleveError {
  constructor(message = 'Not valid') {
    super(message, 'InvalidError');
  }
}
