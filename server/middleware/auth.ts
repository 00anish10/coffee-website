import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const DEFAULT_JWT_SECRET = 'himalayan-arabica-dev-secret-change-in-prod';
const JWT_SECRET = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
const ACCESS_TOKEN_EXPIRE_MINUTES = Number(process.env.ACCESS_TOKEN_EXPIRE_MINUTES);
const ACCESS_TOKEN_TTL_SECONDS =
  Number.isFinite(ACCESS_TOKEN_EXPIRE_MINUTES) && ACCESS_TOKEN_EXPIRE_MINUTES > 0
    ? Math.floor(ACCESS_TOKEN_EXPIRE_MINUTES) * 60
    : 12 * 60 * 60;

if (process.env.NODE_ENV === 'production' && JWT_SECRET === DEFAULT_JWT_SECRET) {
  console.warn(
    '[security] Using the default JWT_SECRET in production. Set JWT_SECRET to a long random value.'
  );
}

export interface AdminJwtPayload {
  email: string;
  role: 'admin';
}

export interface AdminRequest extends Request {
  admin?: AdminJwtPayload;
}

export function signAdminToken(payload: AdminJwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL_SECONDS });
}

export function requireAdminAuth(
  req: AdminRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. Missing Bearer token.' });
    return;
  }

  const token = authHeader.slice(7).trim();
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminJwtPayload;
    if (decoded.role !== 'admin') {
      res.status(403).json({ error: 'Insufficient permissions.' });
      return;
    }
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired session token.' });
  }
}
