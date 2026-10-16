import type { ErrorRequestHandler } from 'express';
import { DomainError } from '../domain/errors.js';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof DomainError) {
    const status =
      err.code === 'PROJECT_DUPLICATE' || err.code === 'TASK_DUPLICATE' ? 409 : 422;
    res.status(status).json({ error: { code: err.code, message: err.message } });
    return;
  }
  res.status(500).json({ error: { code: 'INTERNAL', message: 'unexpected error' } });
};
