import { ProjectError } from './project.error';

export class InvalidError extends ProjectError {
  constructor(message = 'Not valid') {
    super(message, 'InvalidError');
  }
}
