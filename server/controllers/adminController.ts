import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import {
  createGalleryImage,
  createMenuItem,
  createTestimonial,
  deleteContactMessage,
  deleteGalleryImage,
  deleteMenuItem,
  deleteTestimonial,
  getCategories,
  getContactMessages,
  getGalleryImages,
  getMenuItems,
  getNewsletterSubscribers,
  getStoreStats,
  getTestimonials,
  markContactMessageRead,
  updateMenuItem,
} from '../services/storeService.ts';
import {
  adminLoginSchema,
  galleryCreateSchema,
  galleryUploadSchema,
  menuItemCreateSchema,
  menuItemUpdateSchema,
  testimonialCreateSchema,
} from '../middleware/validation.ts';
import { signAdminToken } from '../middleware/auth.ts';
import { deleteUploadedImage, saveGalleryImage } from '../services/uploadService.ts';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@himalayanarabicabeans.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ThamelArabica2012!';

/** Constant-time string comparison to avoid leaking credential length/timing. */
function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) {
    // Still perform a comparison so the code path length is similar.
    crypto.timingSafeEqual(a, a);
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

export async function handleAdminLogin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = adminLoginSchema.parse(req.body);
    const emailMatches = safeEqual(email.toLowerCase(), ADMIN_EMAIL.toLowerCase());
    const passwordMatches = safeEqual(password, ADMIN_PASSWORD);

    if (!emailMatches || !passwordMatches) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const token = signAdminToken({ email: ADMIN_EMAIL, role: 'admin' });
    res.json({
      token,
      admin: { email: ADMIN_EMAIL, role: 'admin' },
    });
  } catch (err) {
    next(err);
  }
}

export async function handleAdminGetDashboard(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const [
      categories,
      menuItems,
      galleryImages,
      testimonials,
      contactMessages,
      newsletterSubscribers,
      stats,
    ] = await Promise.all([
      getCategories(),
      getMenuItems(),
      getGalleryImages(),
      getTestimonials(),
      getContactMessages(),
      getNewsletterSubscribers(),
      getStoreStats(),
    ]);

    res.json({
      categories,
      menuItems,
      galleryImages,
      testimonials,
      contactMessages,
      newsletterSubscribers,
      stats,
    });
  } catch (err) {
    next(err);
  }
}

export async function handleAdminCreateMenuItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = menuItemCreateSchema.parse(req.body);
    const item = await createMenuItem(data);
    res.status(201).json({ item });
  } catch (err) {
    next(err);
  }
}

export async function handleAdminUpdateMenuItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const patch = menuItemUpdateSchema.parse(req.body);
    const updated = await updateMenuItem(id, patch);
    if (!updated) {
      res.status(404).json({ error: 'Menu item not found.' });
      return;
    }
    res.json({ item: updated });
  } catch (err) {
    next(err);
  }
}

export async function handleAdminDeleteMenuItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const ok = await deleteMenuItem(id);
    if (!ok) {
      res.status(404).json({ error: 'Menu item not found.' });
      return;
    }
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
}

export async function handleAdminUploadGalleryImage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { dataUrl } = galleryUploadSchema.parse(req.body);
    const imageUrl = await saveGalleryImage(dataUrl);
    res.status(201).json({ imageUrl });
  } catch (err) {
    next(err);
  }
}

export async function handleAdminCreateGalleryImage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = galleryCreateSchema.parse(req.body);
    const image = await createGalleryImage(data);
    res.status(201).json({ image });
  } catch (err) {
    next(err);
  }
}

export async function handleAdminDeleteGalleryImage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const removed = await deleteGalleryImage(id);
    if (!removed) {
      res.status(404).json({ error: 'Gallery image not found.' });
      return;
    }
    await deleteUploadedImage(removed.imageUrl);
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
}

export async function handleAdminCreateTestimonial(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = testimonialCreateSchema.parse(req.body);
    const testimonial = await createTestimonial(data);
    res.status(201).json({ testimonial });
  } catch (err) {
    next(err);
  }
}

export async function handleAdminDeleteTestimonial(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const ok = await deleteTestimonial(id);
    if (!ok) {
      res.status(404).json({ error: 'Testimonial not found.' });
      return;
    }
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
}

export async function handleAdminMarkMessageRead(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const updated = await markContactMessageRead(id);
    if (!updated) {
      res.status(404).json({ error: 'Contact message not found.' });
      return;
    }
    res.json({ message: updated });
  } catch (err) {
    next(err);
  }
}

export async function handleAdminDeleteMessage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const ok = await deleteContactMessage(id);
    if (!ok) {
      res.status(404).json({ error: 'Contact message not found.' });
      return;
    }
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
}
