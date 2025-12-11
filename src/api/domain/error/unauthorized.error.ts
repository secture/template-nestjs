import { ProjectError } from './project.error';

export class UnauthorizedError extends ProjectError {
  constructor(message = 'Unauthorized') {
    super(message, 'UnauthorizedError');
  }
}
