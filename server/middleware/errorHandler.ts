import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      details: err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  const candidate = err as { statusCode?: number; status?: number; message?: string };
  const status =
    typeof candidate?.statusCode === 'number'
      ? candidate.statusCode
      : typeof candidate?.status === 'number'
        ? candidate.status
        : 500;

  if (status >= 400 && status < 500) {
    res.status(status).json({ error: candidate.message || 'Bad request.' });
    return;
  }

  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal server error. Please try again later.',
  });
}
