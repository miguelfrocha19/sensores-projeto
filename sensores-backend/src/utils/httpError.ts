// Classe de erro que carrega um status code HTTP (ex: 404, 403).
// TODO — Fase 3.

// Classe de erro que carrega um status code HTTP (ex: 404, 403).
// TODO — Fase 3.
export class HttpError extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'HttpError';
  }
}