export class EleveError extends Error {
  constructor(message = 'eleve.error', name = 'EleveError') {
    super(message);
    this.name = name;
  }
}
