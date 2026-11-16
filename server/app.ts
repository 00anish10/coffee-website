import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { apiRouter } from './routes/apiRoutes.ts';
import { adminRouter } from './routes/adminRoutes.ts';
import { errorHandler } from './middleware/errorHandler.ts';
import { UPLOAD_DIR } from './services/uploadService.ts';

function resolveAllowedOrigins(): string[] {
  return [process.env.APP_URL, ...(process.env.CORS_ALLOWED_ORIGINS ?? '').split(',')]
    .map((value) => value?.trim())
    .filter(
      (value): value is string =>
        Boolean(value) && !value!.startsWith('MY_') && value !== 'undefined'
    );
}

export function createExpressApp() {
  const app = express();
  const isProduction = process.env.NODE_ENV === 'production';

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  // Configure Helmet without blocking iframe embedding or Google Fonts / Maps assets
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      frameguard: false,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    })
  );

  const allowedOrigins = resolveAllowedOrigins();
  app.use(
    cors({
      // Same-origin requests need no CORS header; in production only the
      // explicitly configured origins are allowed.
      origin: allowedOrigins.length > 0 ? allowedOrigins : isProduction ? false : true,
      credentials: true,
    })
  );

  // Admin gallery uploads arrive as base64 JSON; allow a larger body for this
  // route only while keeping the global JSON limit small.
  app.use('/api/admin/gallery/upload', express.json({ limit: '8mb' }));
  app.use(express.json({ limit: '1mb' }));

  // Uploaded gallery photos are served straight from disk.
  app.use(
    '/uploads',
    express.static(UPLOAD_DIR, { maxAge: '30d', immutable: true, fallthrough: false })
  );

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests from this IP, please try again shortly.' },
  });

  // Brute-force protection for the admin login specifically.
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: { error: 'Too many sign-in attempts. Please wait 15 minutes and try again.' },
  });

  app.use('/api', apiLimiter);
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'himalayan-arabica-beans',
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  });
  app.use('/api/admin/login', loginLimiter);
  app.use('/api/admin', adminRouter);
  app.use('/api', apiRouter);

  // JSON 404 for unmatched API routes (keeps the SPA fallback unaffected).
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'API endpoint not found.' });
  });

  app.use(errorHandler);
  return app;
}
