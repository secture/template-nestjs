import { ProjectError } from './project.error';

export class NotFoundError extends ProjectError {
  constructor(message = 'Not found') {
    super(message, 'NotFoundError');
  }
}
