import { EleveError } from './eleve.error';

export class InvalidError extends EleveError {
  constructor(message = 'eleve.invalid') {
    super(message, 'InvalidError');
  }
}
