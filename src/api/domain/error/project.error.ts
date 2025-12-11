export class ProjectError extends Error {
  constructor(message = 'project.error', name = 'ProjectError') {
    super(message);
    this.name = name;
  }
}
