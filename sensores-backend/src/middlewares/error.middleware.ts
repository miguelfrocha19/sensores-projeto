// Middleware central de erros: captura exceções e devolve o status/JSON corretos.
// TODO — Fase 3.
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/httpError';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  console.error('Erro inesperado:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
}