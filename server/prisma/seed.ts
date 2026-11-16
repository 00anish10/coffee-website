import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import { INITIAL_STORE_DATA, type StoreDatabase } from '../data/seedData.ts';

function loadSeedData(): StoreDatabase {
  const storePath = path.resolve(process.cwd(), 'server', 'data', 'store.json');
  try {
    const parsed = JSON.parse(fs.readFileSync(storePath, 'utf-8')) as Partial<StoreDatabase>;
    if (Array.isArray(parsed.categories) && parsed.categories.length > 0) {
      return {
        categories: parsed.categories,
        menuItems: parsed.menuItems ?? [],
        testimonials: parsed.testimonials ?? [],
        galleryImages: parsed.galleryImages ?? [],
        contactMessages: parsed.contactMessages ?? [],
        newsletterSubscribers: parsed.newsletterSubscribers ?? [],
      };
    }
  } catch {
    // Fall back to the bundled seed data when store.json is absent.
  }
  return INITIAL_STORE_DATA;
}

async function main() {
  const prisma = new PrismaClient();

  try {
    // Seeding is idempotent: never overwrite a database that already has data.
    if ((await prisma.category.count()) > 0) {
      console.log('Database already contains data; skipping seed.');
      return;
    }

    const data = loadSeedData();

    await prisma.category.createMany({
      data: data.categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        sortOrder: cat.sortOrder,
      })),
      skipDuplicates: true,
    });

    await prisma.menuItem.createMany({
      data: data.menuItems.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        priceNpr: item.priceNpr,
        imageUrl: item.imageUrl,
        originNote: item.originNote,
        isFeatured: item.isFeatured,
        isAvailable: item.isAvailable,
        categoryId: item.categoryId,
        createdAt: new Date(item.createdAt),
      })),
      skipDuplicates: true,
    });

    await prisma.testimonial.createMany({
      data: data.testimonials.map((t) => ({
        id: t.id,
        authorName: t.authorName,
        authorRole: t.authorRole,
        origin: t.origin,
        rating: t.rating,
        quote: t.quote,
        visitDate: t.visitDate,
        isFeatured: t.isFeatured,
      })),
      skipDuplicates: true,
    });

    await prisma.galleryImage.createMany({
      data: data.galleryImages.map((img) => ({
        id: img.id,
        title: img.title,
        category: img.category,
        caption: img.caption,
        imageUrl: img.imageUrl,
        aspectRatio: img.aspectRatio,
        createdAt: new Date(img.createdAt),
      })),
      skipDuplicates: true,
    });

    await prisma.contactMessage.createMany({
      data: data.contactMessages.map((msg) => ({
        id: msg.id,
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        message: msg.message,
        status: msg.status,
        createdAt: new Date(msg.createdAt),
      })),
      skipDuplicates: true,
    });

    await prisma.newsletterSubscriber.createMany({
      data: data.newsletterSubscribers.map((sub) => ({
        id: sub.id,
        email: sub.email,
        subscribedAt: new Date(sub.subscribedAt),
      })),
      skipDuplicates: true,
    });

    console.log('Seeded Himalayan Arabica Beans PostgreSQL database.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
