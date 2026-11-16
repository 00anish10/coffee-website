import { Prisma, PrismaClient } from '@prisma/client';
import type {
  Category,
  ContactMessage,
  GalleryImage,
  MenuItem,
  NewsletterSubscriber,
  Testimonial,
} from '../data/seedData.ts';

/**
 * A single Prisma client is reused across the process. In development, tsx may
 * reload modules, so the client is cached on globalThis to avoid exhausting
 * PostgreSQL connections.
 */
const globalForPrisma = globalThis as unknown as { __habPrisma?: PrismaClient };
export const prisma = globalForPrisma.__habPrisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__habPrisma = prisma;
}

type MenuItemRow = Prisma.MenuItemGetPayload<{ include: { category: true } }>;
type CategoryRow = Prisma.CategoryGetPayload<Record<string, never>>;
type TestimonialRow = Prisma.TestimonialGetPayload<Record<string, never>>;
type GalleryRow = Prisma.GalleryImageGetPayload<Record<string, never>>;
type ContactRow = Prisma.ContactMessageGetPayload<Record<string, never>>;
type SubscriberRow = Prisma.NewsletterSubscriberGetPayload<Record<string, never>>;

function isPrismaError(err: unknown, code: string): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === code;
}

function toCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    sortOrder: row.sortOrder,
  };
}

function toMenuItem(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    priceNpr: row.priceNpr,
    imageUrl: row.imageUrl,
    categoryId: row.categoryId,
    categorySlug: row.category.slug,
    originNote: row.originNote,
    isFeatured: row.isFeatured,
    isAvailable: row.isAvailable,
    createdAt: row.createdAt.toISOString(),
  };
}

function toTestimonial(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    authorName: row.authorName,
    authorRole: row.authorRole,
    origin: row.origin,
    rating: row.rating,
    quote: row.quote,
    visitDate: row.visitDate,
    isFeatured: row.isFeatured,
  };
}

function toGalleryImage(row: GalleryRow): GalleryImage {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    caption: row.caption,
    imageUrl: row.imageUrl,
    aspectRatio: row.aspectRatio as GalleryImage['aspectRatio'],
    createdAt: row.createdAt.toISOString(),
  };
}

function toContactMessage(row: ContactRow): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    status: row.status as ContactMessage['status'],
    createdAt: row.createdAt.toISOString(),
  };
}

function toSubscriber(row: SubscriberRow): NewsletterSubscriber {
  return {
    id: row.id,
    email: row.email,
    subscribedAt: row.subscribedAt.toISOString(),
  };
}

const MENU_ORDER: Prisma.MenuItemOrderByWithRelationInput[] = [
  { category: { sortOrder: 'asc' } },
  { createdAt: 'asc' },
];

export async function getCategories(): Promise<Category[]> {
  const rows = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
  return rows.map(toCategory);
}

export async function getMenuItems(categorySlug?: string): Promise<MenuItem[]> {
  const where: Prisma.MenuItemWhereInput =
    categorySlug && categorySlug !== 'all'
      ? { category: { is: { slug: categorySlug } } }
      : {};

  const rows = await prisma.menuItem.findMany({
    where,
    include: { category: true },
    orderBy: MENU_ORDER,
  });
  return rows.map(toMenuItem);
}

export async function getFeaturedMenuItems(): Promise<MenuItem[]> {
  const rows = await prisma.menuItem.findMany({
    where: { isFeatured: true, isAvailable: true },
    include: { category: true },
    orderBy: MENU_ORDER,
  });
  return rows.map(toMenuItem);
}

export async function createMenuItem(
  input: Omit<MenuItem, 'id' | 'createdAt' | 'categoryId'>
): Promise<MenuItem> {
  const category =
    (await prisma.category.findUnique({ where: { slug: input.categorySlug } })) ??
    (await prisma.category.findFirst({ orderBy: { sortOrder: 'asc' } }));

  if (!category) {
    throw new Error('No menu categories are configured yet.');
  }

  const created = await prisma.menuItem.create({
    data: {
      name: input.name,
      description: input.description,
      priceNpr: input.priceNpr,
      imageUrl: input.imageUrl,
      originNote: input.originNote,
      isFeatured: input.isFeatured,
      isAvailable: input.isAvailable,
      categoryId: category.id,
    },
    include: { category: true },
  });

  return toMenuItem(created);
}

export async function updateMenuItem(
  id: string,
  patch: Partial<Omit<MenuItem, 'id' | 'createdAt'>>
): Promise<MenuItem | null> {
  const data: Prisma.MenuItemUncheckedUpdateInput = {};

  if (patch.name !== undefined) data.name = patch.name;
  if (patch.description !== undefined) data.description = patch.description;
  if (patch.priceNpr !== undefined) data.priceNpr = patch.priceNpr;
  if (patch.imageUrl !== undefined) data.imageUrl = patch.imageUrl;
  if (patch.originNote !== undefined) data.originNote = patch.originNote;
  if (patch.isFeatured !== undefined) data.isFeatured = patch.isFeatured;
  if (patch.isAvailable !== undefined) data.isAvailable = patch.isAvailable;

  if (patch.categorySlug) {
    const category = await prisma.category.findUnique({ where: { slug: patch.categorySlug } });
    if (category) data.categoryId = category.id;
  }

  try {
    const updated = await prisma.menuItem.update({
      where: { id },
      data,
      include: { category: true },
    });
    return toMenuItem(updated);
  } catch (err) {
    if (isPrismaError(err, 'P2025')) return null;
    throw err;
  }
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  try {
    await prisma.menuItem.delete({ where: { id } });
    return true;
  } catch (err) {
    if (isPrismaError(err, 'P2025')) return false;
    throw err;
  }
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const rows = await prisma.galleryImage.findMany({ orderBy: { createdAt: 'desc' } });
  return rows.map(toGalleryImage);
}

export async function createGalleryImage(
  input: Omit<GalleryImage, 'id' | 'createdAt'>
): Promise<GalleryImage> {
  const created = await prisma.galleryImage.create({
    data: {
      title: input.title,
      category: input.category,
      caption: input.caption,
      imageUrl: input.imageUrl,
      aspectRatio: input.aspectRatio,
    },
  });
  return toGalleryImage(created);
}

export async function deleteGalleryImage(id: string): Promise<GalleryImage | null> {
  const existing = await prisma.galleryImage.findUnique({ where: { id } });
  if (!existing) return null;
  await prisma.galleryImage.delete({ where: { id } });
  return toGalleryImage(existing);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const rows = await prisma.testimonial.findMany({
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
  });
  return rows.map(toTestimonial);
}

export async function createTestimonial(
  input: Omit<Testimonial, 'id'>
): Promise<Testimonial> {
  const created = await prisma.testimonial.create({
    data: {
      authorName: input.authorName,
      authorRole: input.authorRole,
      origin: input.origin,
      rating: input.rating,
      quote: input.quote,
      visitDate: input.visitDate,
      isFeatured: input.isFeatured,
    },
  });
  return toTestimonial(created);
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  try {
    await prisma.testimonial.delete({ where: { id } });
    return true;
  } catch (err) {
    if (isPrismaError(err, 'P2025')) return false;
    throw err;
  }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const rows = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  return rows.map(toContactMessage);
}

export async function createContactMessage(
  input: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>
): Promise<ContactMessage> {
  const created = await prisma.contactMessage.create({
    data: {
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message,
      status: 'unread',
    },
  });
  return toContactMessage(created);
}

export async function markContactMessageRead(
  id: string
): Promise<ContactMessage | null> {
  try {
    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status: 'read' },
    });
    return toContactMessage(updated);
  } catch (err) {
    if (isPrismaError(err, 'P2025')) return null;
    throw err;
  }
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  try {
    await prisma.contactMessage.delete({ where: { id } });
    return true;
  } catch (err) {
    if (isPrismaError(err, 'P2025')) return false;
    throw err;
  }
}

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  const rows = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: 'desc' },
  });
  return rows.map(toSubscriber);
}

export async function subscribeNewsletter(
  email: string
): Promise<{ subscriber: NewsletterSubscriber; alreadySubscribed: boolean }> {
  const normalized = email.trim().toLowerCase();

  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email: normalized },
  });
  if (existing) {
    return { subscriber: toSubscriber(existing), alreadySubscribed: true };
  }

  try {
    const created = await prisma.newsletterSubscriber.create({
      data: { email: normalized },
    });
    return { subscriber: toSubscriber(created), alreadySubscribed: false };
  } catch (err) {
    if (isPrismaError(err, 'P2002')) {
      const found = await prisma.newsletterSubscriber.findUnique({
        where: { email: normalized },
      });
      if (found) {
        return { subscriber: toSubscriber(found), alreadySubscribed: true };
      }
    }
    throw err;
  }
}

export interface StoreStats {
  menuItems: number;
  featuredItems: number;
  soldOutItems: number;
  galleryImages: number;
  testimonials: number;
  unreadMessages: number;
  newsletterSubscribers: number;
}

export async function getStoreStats(): Promise<StoreStats> {
  const [
    menuItems,
    featuredItems,
    soldOutItems,
    galleryImages,
    testimonials,
    unreadMessages,
    newsletterSubscribers,
  ] = await Promise.all([
    prisma.menuItem.count(),
    prisma.menuItem.count({ where: { isFeatured: true } }),
    prisma.menuItem.count({ where: { isAvailable: false } }),
    prisma.galleryImage.count(),
    prisma.testimonial.count(),
    prisma.contactMessage.count({ where: { status: 'unread' } }),
    prisma.newsletterSubscriber.count(),
  ]);

  return {
    menuItems,
    featuredItems,
    soldOutItems,
    galleryImages,
    testimonials,
    unreadMessages,
    newsletterSubscribers,
  };
}
