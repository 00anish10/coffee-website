export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  priceNpr: number;
  imageUrl: string;
  categoryId: string;
  categorySlug: string;
  originNote: string;
  isFeatured: boolean;
  isAvailable: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  authorName: string;
  authorRole: string;
  origin: string;
  rating: number;
  quote: string;
  visitDate: string;
  isFeatured: boolean;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: string;
  caption: string;
  imageUrl: string;
  aspectRatio: 'landscape' | 'portrait' | 'square';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface StoreDatabase {
  categories: Category[];
  menuItems: MenuItem[];
  testimonials: Testimonial[];
  galleryImages: GalleryImage[];
  contactMessages: ContactMessage[];
  newsletterSubscribers: NewsletterSubscriber[];
}

export const INITIAL_STORE_DATA: StoreDatabase = {
  categories: [
    {
      id: 'cat-espresso',
      name: 'Espresso & Classics',
      slug: 'espresso-classics',
      description: 'Pulled from 100% single-origin high-altitude Nepali Arabica beans.',
      sortOrder: 1,
    },
    {
      id: 'cat-signature',
      name: 'Signature Flavors',
      slug: 'signature-flavors',
      description: 'Selected highlights from our 100+ house-crafted coffee flavor recipes.',
      sortOrder: 2,
    },
    {
      id: 'cat-cold',
      name: 'Cold Brew & Iced',
      slug: 'cold-brew-iced',
      description: 'Slow-steeped 18-hour Himalayan cold brews and chilled espresso drinks.',
      sortOrder: 3,
    },
    {
      id: 'cat-pastries',
      name: 'Artisan Pastries',
      slug: 'artisan-pastries',
      description: 'Freshly baked croissants, rich brownies, and cheesecakes made every morning.',
      sortOrder: 4,
    },
    {
      id: 'cat-beans',
      name: 'Packaged Beans',
      slug: 'packaged-beans',
      description: 'Take home freshly roasted whole beans and ground Nepali Arabica.',
      sortOrder: 5,
    },
  ],
  menuItems: [
    {
      id: 'item-1',
      name: 'Himalayan Double Espresso',
      description:
        'Pure double extraction of high-altitude Ilam and Nuwakot Arabica with dense caramel crema and dark cocoa finish.',
      priceNpr: 220,
      imageUrl: '/src/assets/images/signature_espresso_crema_1794813060389.jpg',
      categoryId: 'cat-espresso',
      categorySlug: 'espresso-classics',
      originNote: 'Ilam & Nuwakot · 1,650m',
      isFeatured: true,
      isAvailable: true,
      createdAt: '2025-01-10T08:00:00.000Z',
    },
    {
      id: 'item-2',
      name: 'Thamel Velvety Cappuccino',
      description:
        'Balanced double ristretto layered under silky micro-foamed milk with subtle toasted hazelnut aroma.',
      priceNpr: 290,
      imageUrl: '/src/assets/images/signature_spiced_mocha_1794813060671.jpg',
      categoryId: 'cat-espresso',
      categorySlug: 'espresso-classics',
      originNote: 'Medium Roast · 100% Arabica',
      isFeatured: true,
      isAvailable: true,
      createdAt: '2025-01-10T08:05:00.000Z',
    },
    {
      id: 'item-3',
      name: 'Himalayan Cardamom Spiced Mocha',
      description:
        'Our signature Thamel favorite blending Nepali Arabica espresso, organic dark cacao, and freshly crushed green cardamom.',
      priceNpr: 360,
      imageUrl: '/src/assets/images/signature_spiced_mocha_1794813060671.jpg',
      categoryId: 'cat-signature',
      categorySlug: 'signature-flavors',
      originNote: 'House Signature · 100+ Flavors',
      isFeatured: true,
      isAvailable: true,
      createdAt: '2025-01-10T08:10:00.000Z',
    },
    {
      id: 'item-4',
      name: 'Mustang Honey Cinnamon Latte',
      description:
        'Steamed organic milk infused with wild Himalayan cliff honey and aromatic cinnamon over freshly pulled Arabica.',
      priceNpr: 380,
      imageUrl: '/src/assets/images/hero_himalayan_cafe_1794813060283.jpg',
      categoryId: 'cat-signature',
      categorySlug: 'signature-flavors',
      originNote: 'Wild Cliff Honey · Espresso',
      isFeatured: true,
      isAvailable: true,
      createdAt: '2025-01-10T08:15:00.000Z',
    },
    {
      id: 'item-5',
      name: 'Salted Caramel Hazelnut Macchiato',
      description:
        'Velvety steamed milk marked with double Himalayan espresso, roasted hazelnut essence, and house caramel drizzle.',
      priceNpr: 390,
      imageUrl: '/src/assets/images/signature_espresso_crema_1794813060389.jpg',
      categoryId: 'cat-signature',
      categorySlug: 'signature-flavors',
      originNote: 'Sweet & Nutty · House Syrup',
      isFeatured: false,
      isAvailable: true,
      createdAt: '2025-01-10T08:20:00.000Z',
    },
    {
      id: 'item-6',
      name: '18-Hour Himalayan Cold Brew',
      description:
        'Coarse-ground Gulmi Arabica steeped in cold mountain-filtered water for 18 hours for crisp citrus and chocolate clarity.',
      priceNpr: 340,
      imageUrl: '/src/assets/images/signature_pastry_croissant_1794813060929.jpg',
      categoryId: 'cat-cold',
      categorySlug: 'cold-brew-iced',
      originNote: 'Gulmi Single Origin · Zero Bitterness',
      isFeatured: true,
      isAvailable: true,
      createdAt: '2025-01-10T08:25:00.000Z',
    },
    {
      id: 'item-7',
      name: 'Iced Everest Vanilla Espresso',
      description:
        'Chilled double espresso shaken with Madagascar vanilla bean infusion and cold milk over crystal ice.',
      priceNpr: 360,
      imageUrl: '/src/assets/images/signature_pastry_croissant_1794813060929.jpg',
      categoryId: 'cat-cold',
      categorySlug: 'cold-brew-iced',
      originNote: 'Iced Espresso · Vanilla Bean',
      isFeatured: false,
      isAvailable: true,
      createdAt: '2025-01-10T08:30:00.000Z',
    },
    {
      id: 'item-8',
      name: 'Artisan Butter Croissant',
      description:
        'Hand-laminated golden pastry baked fresh every morning at 6:30 AM with crisp honeycomb layers and cultured butter.',
      priceNpr: 260,
      imageUrl: '/src/assets/images/signature_pastry_croissant_1794813060929.jpg',
      categoryId: 'cat-pastries',
      categorySlug: 'artisan-pastries',
      originNote: 'Baked Fresh Daily · Thamel Bakery',
      isFeatured: true,
      isAvailable: true,
      createdAt: '2025-01-10T08:35:00.000Z',
    },
    {
      id: 'item-9',
      name: 'Dark Chocolate Espresso Brownie',
      description:
        'Dense, fudgy Belgian chocolate square baked with a shot of Himalayan espresso and flaky sea salt.',
      priceNpr: 310,
      imageUrl: '/src/assets/images/signature_pastry_croissant_1794813060929.jpg',
      categoryId: 'cat-pastries',
      categorySlug: 'artisan-pastries',
      originNote: 'House Baked · Rich Cacao',
      isFeatured: false,
      isAvailable: true,
      createdAt: '2025-01-10T08:40:00.000Z',
    },
    {
      id: 'item-10',
      name: 'Himalayan Blueberry Cheesecake',
      description:
        'Creamy slow-baked cheesecake on a spiced biscuit crust topped with wild mountain blueberry compote.',
      priceNpr: 450,
      imageUrl: '/src/assets/images/signature_pastry_croissant_1794813060929.jpg',
      categoryId: 'cat-pastries',
      categorySlug: 'artisan-pastries',
      originNote: 'Vegetarian · Daily Small Batch',
      isFeatured: false,
      isAvailable: true,
      createdAt: '2025-01-10T08:45:00.000Z',
    },
    {
      id: 'item-11',
      name: '250g Organic Nepali Arabica Whole Bean',
      description:
        'Small-batch medium roast from shade-grown Himalayan farms in Sindupalchok and Gorkha. Available whole bean or ground to order.',
      priceNpr: 650,
      imageUrl: '/src/assets/images/about_thamel_roastery_1794813060860.jpg',
      categoryId: 'cat-beans',
      categorySlug: 'packaged-beans',
      originNote: '250g Bag · Washed Process',
      isFeatured: false,
      isAvailable: true,
      createdAt: '2025-01-10T08:50:00.000Z',
    },
    {
      id: 'item-12',
      name: '15-Day Professional Barista Training Pass',
      description:
        'Hands-on specialty coffee curriculum in Thamel covering espresso calibration, milk texturing, latte art, and manual brewing.',
      priceNpr: 15000,
      imageUrl: '/src/assets/images/gallery_barista_pour_1794813062040.jpg',
      categoryId: 'cat-espresso',
      categorySlug: 'espresso-classics',
      originNote: 'Academy · Certificate Included',
      isFeatured: false,
      isAvailable: true,
      createdAt: '2025-01-10T08:55:00.000Z',
    },
  ],
  testimonials: [
    {
      id: 'test-1',
      authorName: 'Elena Vance',
      authorRole: 'Annapurna Circuit Trekker',
      origin: 'Zurich, Switzerland',
      rating: 5,
      quote:
        'After two weeks in the high passes, stepping into Himalayan Arabica Beans on Saat Ghumti Marg felt like home. The cardamom spiced mocha and warm croissant are unmatched in Kathmandu.',
      visitDate: 'October 2025',
      isFeatured: true,
    },
    {
      id: 'test-2',
      authorName: 'Aarav Gurung',
      authorRole: 'Specialty Barista Graduate',
      origin: 'Pokhara, Nepal',
      rating: 5,
      quote:
        'I completed my 15-day barista training here in 2023. Their respect for 100% Nepali Arabica farmers and precision on the espresso bar gave me the confidence to open my own cafe.',
      visitDate: 'January 2026',
      isFeatured: true,
    },
    {
      id: 'test-3',
      authorName: 'Marcus Takahashi',
      authorRole: 'Travel Photographer',
      origin: 'Kyoto, Japan',
      rating: 5,
      quote:
        'Easily my favorite morning ritual in Thamel. Over a hundred flavor combinations, genuinely knowledgeable baristas, and bags of freshly roasted Gorkha beans I brought back to Japan.',
      visitDate: 'March 2026',
      isFeatured: true,
    },
    {
      id: 'test-4',
      authorName: 'claire & Liam O’Connor',
      authorRole: 'Mountaineering Guides',
      origin: 'Dublin, Ireland',
      rating: 5,
      quote:
        'We have been stopping by Himalayan Arabica Beans before every Everest Base Camp departure since 2016. Consistent crema, welcoming staff, and the best blueberry cheesecake in town.',
      visitDate: 'April 2026',
      isFeatured: true,
    },
  ],
  galleryImages: [
    {
      id: 'gal-1',
      title: 'Sunrise Brew Over the Himalayas',
      category: 'Signature Drinks',
      caption: 'Single-origin Nepali Arabica latte poured fresh for early-morning travelers.',
      imageUrl: '/src/assets/images/hero_himalayan_cafe_1794813060283.jpg',
      aspectRatio: 'landscape',
      createdAt: '2025-02-01T08:00:00.000Z',
    },
    {
      id: 'gal-2',
      title: 'The Thamel Espresso Bar',
      category: 'Cafe Interior',
      caption: 'Inside our Saat Ghumti Marg coffee house, serving trekkers and locals since 2012.',
      imageUrl: '/src/assets/images/about_thamel_roastery_1794813060860.jpg',
      aspectRatio: 'landscape',
      createdAt: '2025-02-02T08:00:00.000Z',
    },
    {
      id: 'gal-3',
      title: 'Artisan Milk Pour & Barista Craft',
      category: 'Barista Training',
      caption: 'Precision microfoam pouring during our 15-day professional barista certification.',
      imageUrl: '/src/assets/images/gallery_barista_pour_1794813062040.jpg',
      aspectRatio: 'portrait',
      createdAt: '2025-02-03T08:00:00.000Z',
    },
    {
      id: 'gal-4',
      title: 'Golden Crema Extraction',
      category: 'Roastery & Beans',
      caption: 'Rich double espresso dialed in daily from washed Himalayan Arabica harvests.',
      imageUrl: '/src/assets/images/signature_espresso_crema_1794813060389.jpg',
      aspectRatio: 'square',
      createdAt: '2025-02-04T08:00:00.000Z',
    },
    {
      id: 'gal-5',
      title: 'Spiced Cardamom & Dark Cacao',
      category: 'Signature Drinks',
      caption: 'House-crafted mocha infused with Nepali spices and dark chocolate curls.',
      imageUrl: '/src/assets/images/signature_spiced_mocha_1794813060671.jpg',
      aspectRatio: 'landscape',
      createdAt: '2025-02-05T08:00:00.000Z',
    },
    {
      id: 'gal-6',
      title: 'Morning Bakery & Cold Brew',
      category: 'Pastries & Bakery',
      caption: 'Flaky butter croissants, espresso brownies, and blueberry cheesecake baked every morning.',
      imageUrl: '/src/assets/images/signature_pastry_croissant_1794813060929.jpg',
      aspectRatio: 'landscape',
      createdAt: '2025-02-06T08:00:00.000Z',
    },
  ],
  contactMessages: [
    {
      id: 'msg-1',
      name: 'Sita Sharma',
      email: 'sita.sharma@example.com',
      subject: 'Barista Training Batch Inquiry',
      message: 'Namaste! I would like to know the starting dates for next month’s 15-day barista training program in Thamel.',
      status: 'unread',
      createdAt: '2026-11-12T10:30:00.000Z',
    },
  ],
  newsletterSubscribers: [
    {
      id: 'sub-1',
      email: 'coffee.lover@kathmandu.np',
      subscribedAt: '2026-10-01T09:00:00.000Z',
    },
  ],
};
