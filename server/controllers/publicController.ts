import type { Request, Response, NextFunction } from 'express';
import {
  createContactMessage,
  getCategories,
  getFeaturedMenuItems,
  getGalleryImages,
  getMenuItems,
  getTestimonials,
  subscribeNewsletter,
} from '../services/storeService.ts';
import { contactMessageSchema, newsletterSchema } from '../middleware/validation.ts';

export async function handleGetMenu(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const [categories, items] = await Promise.all([
      getCategories(),
      getMenuItems(category),
    ]);
    res.json({
      categories,
      items: items.filter((item) => item.isAvailable),
    });
  } catch (err) {
    next(err);
  }
}

export async function handleGetFeaturedMenu(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const items = await getFeaturedMenuItems();
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

export async function handleGetGallery(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const images = await getGalleryImages();
    res.json({ images });
  } catch (err) {
    next(err);
  }
}

export async function handleGetTestimonials(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const testimonials = await getTestimonials();
    res.json({ testimonials });
  } catch (err) {
    next(err);
  }
}

export async function handlePostContact(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { honeypot, ...payload } = contactMessageSchema.parse(req.body);

    // Silently accept honeypot submissions so bots do not learn they were caught.
    if (honeypot && honeypot.trim().length > 0) {
      res.status(201).json({
        message: 'Thank you for reaching out. Our Thamel team will reply shortly.',
      });
      return;
    }

    const created = await createContactMessage(payload);
    res.status(201).json({
      message: 'Thank you for reaching out. Our Thamel team will reply shortly.',
      contact: created,
    });
  } catch (err) {
    next(err);
  }
}

export async function handlePostNewsletter(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsed = newsletterSchema.parse(req.body);
    const result = await subscribeNewsletter(parsed.email);
    res.status(result.alreadySubscribed ? 200 : 201).json({
      message: result.alreadySubscribed
        ? 'You are already subscribed to our Himalayan roast dispatches.'
        : 'Welcome to Himalayan Arabica Beans. You are subscribed!',
      alreadySubscribed: result.alreadySubscribed,
      subscriber: result.subscriber,
    });
  } catch (err) {
    next(err);
  }
}
