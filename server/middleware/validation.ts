import { z } from 'zod';

/**
 * Accepts either a site-relative asset path ("/src/assets/...") or an
 * absolute http(s) URL. Rejects javascript:, data:, and traversal-ish input.
 */
export const imageUrlSchema = z
  .string()
  .trim()
  .min(1, 'Image URL is required')
  .max(600, 'Image URL is too long')
  .refine(
    (value) =>
      /^\/(?!\/)[\w\-./ %]+$/.test(value) || /^https?:\/\/[^\s]+$/i.test(value),
    'Use a relative path like /src/assets/images/photo.jpg or an http(s) URL'
  );

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Please enter a valid email address').max(160),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters').max(140),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000),
  // Hidden field: real guests leave it empty, simple bots fill it in.
  honeypot: z.string().max(200).optional(),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address').max(160),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().email('Valid admin email required').max(160),
  password: z.string().min(4, 'Password required').max(200),
});

const menuItemBaseSchema = z.object({
  name: z.string().trim().min(2, 'Name is too short').max(120),
  description: z.string().trim().min(8, 'Add a short description').max(600),
  priceNpr: z.coerce.number().int().min(50).max(50000),
  imageUrl: imageUrlSchema,
  categorySlug: z.string().trim().min(1),
  originNote: z.string().trim().min(2).max(80),
  isFeatured: z.boolean(),
  isAvailable: z.boolean(),
});

export const menuItemCreateSchema = menuItemBaseSchema.extend({
  originNote: menuItemBaseSchema.shape.originNote.default('100% Nepali Arabica'),
  isFeatured: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
});

// No defaults here: a partial patch must never reset untouched fields.
export const menuItemUpdateSchema = menuItemBaseSchema.partial();

export const galleryCreateSchema = z.object({
  title: z.string().trim().min(2).max(120),
  category: z.string().trim().min(2).max(60),
  caption: z.string().trim().min(5).max(300),
  imageUrl: imageUrlSchema,
  aspectRatio: z.enum(['landscape', 'portrait', 'square']).default('landscape'),
});

export const galleryUploadSchema = z.object({
  dataUrl: z
    .string()
    .min(64, 'Image data is missing')
    .max(9_000_000, 'Image is too large. Please keep it under 5 MB.')
    .regex(/^data:image\/(?:jpeg|png|webp|gif|avif);base64,/, 'Unsupported image format'),
});

export const testimonialCreateSchema = z.object({
  authorName: z.string().trim().min(2).max(80),
  authorRole: z.string().trim().min(2).max(80),
  origin: z.string().trim().min(2).max(80),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  quote: z.string().trim().min(12).max(600),
  visitDate: z.string().trim().min(3).max(40),
  isFeatured: z.boolean().default(true),
});
