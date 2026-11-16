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

export interface DashboardStats {
  menuItems: number;
  featuredItems: number;
  soldOutItems: number;
  galleryImages: number;
  testimonials: number;
  unreadMessages: number;
  newsletterSubscribers: number;
}

export interface AdminDashboard {
  categories: Category[];
  menuItems: MenuItem[];
  galleryImages: GalleryImage[];
  testimonials: Testimonial[];
  contactMessages: ContactMessage[];
  newsletterSubscribers: NewsletterSubscriber[];
  stats: DashboardStats;
}

export class ApiError extends Error {
  status: number;
  details?: { path: string; message: string }[];

  constructor(message: string, status: number, details?: { path: string; message: string }[]) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const { headers, ...rest } = options ?? {};
  const res = await fetch(url, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(headers ?? {}),
    },
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detailText =
      Array.isArray(payload.details) && payload.details.length > 0
        ? ` ${payload.details.map((d: { message: string }) => d.message).join(' ')}`
        : '';
    throw new ApiError(
      `${payload.error || `Request failed (${res.status})`}${detailText}`,
      res.status,
      payload.details
    );
  }
  return payload as T;
}

export function fetchMenu(category?: string) {
  const params = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
  return requestJson<{ categories: Category[]; items: MenuItem[] }>(`/api/menu${params}`);
}

export function fetchFeaturedMenu() {
  return requestJson<{ items: MenuItem[] }>('/api/menu/featured');
}

export function fetchGallery() {
  return requestJson<{ images: GalleryImage[] }>('/api/gallery');
}

export function fetchTestimonials() {
  return requestJson<{ testimonials: Testimonial[] }>('/api/testimonials');
}

export function submitContactForm(body: {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
}) {
  return requestJson<{ message: string; contact: ContactMessage }>('/api/contact', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function subscribeNewsletter(email: string) {
  return requestJson<{ message: string; alreadySubscribed: boolean }>('/api/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function adminLogin(body: { email: string; password: string }) {
  return requestJson<{ token: string; admin: { email: string; role: string } }>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function fetchAdminDashboard(token: string) {
  return requestJson<AdminDashboard>('/api/admin/dashboard', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export type MenuItemInput = {
  name: string;
  description: string;
  priceNpr: number;
  imageUrl: string;
  categorySlug: string;
  originNote: string;
  isFeatured: boolean;
  isAvailable: boolean;
};

export function adminCreateMenuItem(token: string, body: MenuItemInput) {
  return requestJson<{ item: MenuItem }>('/api/admin/menu', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
}

export function adminUpdateMenuItem(
  token: string,
  id: string,
  patch: Partial<MenuItemInput>
) {
  return requestJson<{ item: MenuItem }>(`/api/admin/menu/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(patch),
  });
}

export function adminDeleteMenuItem(token: string, id: string) {
  return requestJson<{ deleted: boolean }>(`/api/admin/menu/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function adminUploadGalleryImage(token: string, dataUrl: string) {
  return requestJson<{ imageUrl: string }>('/api/admin/gallery/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ dataUrl }),
  });
}

export function adminCreateGalleryImage(
  token: string,
  body: {
    title: string;
    category: string;
    caption: string;
    imageUrl: string;
    aspectRatio: 'landscape' | 'portrait' | 'square';
  }
) {
  return requestJson<{ image: GalleryImage }>('/api/admin/gallery', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
}

export function adminDeleteGalleryImage(token: string, id: string) {
  return requestJson<{ deleted: boolean }>(`/api/admin/gallery/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function adminCreateTestimonial(
  token: string,
  body: {
    authorName: string;
    authorRole: string;
    origin: string;
    rating: number;
    quote: string;
    visitDate: string;
    isFeatured: boolean;
  }
) {
  return requestJson<{ testimonial: Testimonial }>('/api/admin/testimonials', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
}

export function adminDeleteTestimonial(token: string, id: string) {
  return requestJson<{ deleted: boolean }>(`/api/admin/testimonials/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function adminMarkMessageRead(token: string, id: string) {
  return requestJson<{ message: ContactMessage }>(`/api/admin/messages/${id}/read`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function adminDeleteMessage(token: string, id: string) {
  return requestJson<{ deleted: boolean }>(`/api/admin/messages/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}
