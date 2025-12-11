import { ProjectError } from './project.error';

export class ConflictError extends ProjectError {
  constructor(message = 'Conflict') {
    super(message, 'ConflictError');
  }
}
