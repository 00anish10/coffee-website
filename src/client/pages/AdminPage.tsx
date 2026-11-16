import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Check,
  Coffee,
  Eye,
  EyeOff,
  Images,
  Loader2,
  LogOut,
  MessageSquare,
  Pencil,
  Plus,
  Star,
  Trash2,
  UploadCloud,
  Users,
  X,
} from 'lucide-react';
import {
  ApiError,
  adminCreateGalleryImage,
  adminCreateMenuItem,
  adminCreateTestimonial,
  adminDeleteGalleryImage,
  adminDeleteMenuItem,
  adminDeleteMessage,
  adminDeleteTestimonial,
  adminLogin,
  adminMarkMessageRead,
  adminUpdateMenuItem,
  adminUploadGalleryImage,
  fetchAdminDashboard,
  type MenuItemInput,
} from '../lib/api';
import { SectionTitle } from '../components/Reveal';
import { usePageMeta } from '../hooks/usePageMeta';

type AdminTab = 'menu' | 'gallery' | 'testimonials' | 'messages' | 'subscribers';

interface ToastState {
  type: 'success' | 'error';
  message: string;
}

const EMPTY_MENU_FORM = {
  name: '',
  description: '',
  priceNpr: '320',
  imageUrl: '/src/assets/images/signature_espresso_crema_1794813060389.jpg',
  categorySlug: 'signature-flavors',
  originNote: '100% Nepali Arabica',
  isFeatured: false,
  isAvailable: true,
};

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return 'Something went wrong. Please try again.';
}

export function AdminPage() {
  usePageMeta(
    'Admin – Himalayan Arabica Beans',
    'Private cafe management workspace for Himalayan Arabica Beans.'
  );

  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('hab-admin-jwt');
    } catch {
      return null;
    }
  });
  const [activeTab, setActiveTab] = useState<AdminTab>('menu');
  const [toast, setToast] = useState<ToastState | null>(null);

  // Login form state
  const [email, setEmail] = useState('admin@himalayanarabicabeans.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Menu form state (add + edit share the same form)
  const [menuForm, setMenuForm] = useState({ ...EMPTY_MENU_FORM });
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const menuFormRef = useRef<HTMLFormElement | null>(null);

  // Add Gallery form state
  const [newGallery, setNewGallery] = useState({
    title: '',
    category: 'Cafe Interior',
    caption: '',
    imageUrl: '',
    aspectRatio: 'landscape' as 'landscape' | 'portrait' | 'square',
  });
  const [galleryDragging, setGalleryDragging] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const galleryFileRef = useRef<HTMLInputElement | null>(null);

  // Add Testimonial form state
  const [newTestimonial, setNewTestimonial] = useState({
    authorName: '',
    authorRole: 'Coffee Enthusiast',
    origin: 'Kathmandu, Nepal',
    rating: 5,
    quote: '',
    visitDate: 'November 2026',
  });

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['admin-dashboard', token],
    queryFn: () => fetchAdminDashboard(token as string),
    enabled: Boolean(token),
    retry: false,
  });

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (error instanceof ApiError && error.status === 401) {
      setToken(null);
      try {
        sessionStorage.removeItem('hab-admin-jwt');
      } catch {
        // ignore
      }
    }
  }, [error]);

  const notify = (type: ToastState['type'], message: string) => setToast({ type, message });

  const handleMutationError = (err: unknown) => {
    if (err instanceof ApiError && err.status === 401) {
      setToken(null);
      try {
        sessionStorage.removeItem('hab-admin-jwt');
      } catch {
        // ignore
      }
    }
    notify('error', errorMessage(err));
  };

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['menu'] });
    queryClient.invalidateQueries({ queryKey: ['featured-menu'] });
    queryClient.invalidateQueries({ queryKey: ['gallery'] });
    queryClient.invalidateQueries({ queryKey: ['testimonials'] });
  };

  const resetMenuForm = () => {
    setMenuForm({ ...EMPTY_MENU_FORM });
    setEditingMenuId(null);
  };

  const saveMenuMut = useMutation({
    mutationFn: () => {
      const payload: MenuItemInput = {
        ...menuForm,
        priceNpr: Number(menuForm.priceNpr),
      };
      return editingMenuId
        ? adminUpdateMenuItem(token as string, editingMenuId, payload)
        : adminCreateMenuItem(token as string, payload);
    },
    onSuccess: () => {
      notify('success', editingMenuId ? 'Menu item updated.' : 'Menu item added.');
      resetMenuForm();
      invalidateAll();
    },
    onError: handleMutationError,
  });

  const toggleMenuMut = useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      adminUpdateMenuItem(token as string, id, { isAvailable }),
    onSuccess: () => {
      notify('success', 'Availability updated.');
      invalidateAll();
    },
    onError: handleMutationError,
  });

  const deleteMenuMut = useMutation({
    mutationFn: (id: string) => adminDeleteMenuItem(token as string, id),
    onSuccess: () => {
      notify('success', 'Menu item removed.');
      invalidateAll();
    },
    onError: handleMutationError,
  });

  const createGalleryMut = useMutation({
    mutationFn: () => adminCreateGalleryImage(token as string, newGallery),
    onSuccess: () => {
      notify('success', 'Gallery photo published.');
      setNewGallery((prev) => ({ ...prev, title: '', caption: '', imageUrl: '' }));
      invalidateAll();
    },
    onError: handleMutationError,
  });

  const handleGalleryFile = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      notify('error', 'Use a JPG, PNG, WebP, GIF or AVIF image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      notify('error', 'Image must be 5 MB or smaller.');
      return;
    }

    setGalleryUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) {
        setGalleryUploading(false);
        notify('error', 'Could not read that file.');
        return;
      }

      try {
        const { imageUrl } = await adminUploadGalleryImage(token as string, dataUrl);
        const autoTitle = file.name
          .replace(/\.[^.]+$/, '')
          .replace(/[-_]+/g, ' ')
          .trim()
          .slice(0, 120);
        setNewGallery((prev) => ({
          ...prev,
          imageUrl,
          title: prev.title || autoTitle,
        }));

        const probe = new Image();
        probe.onload = () =>
          setNewGallery((prev) => ({
            ...prev,
            aspectRatio:
              probe.width > probe.height
                ? 'landscape'
                : probe.height > probe.width
                  ? 'portrait'
                  : 'square',
          }));
        probe.src = dataUrl;

        notify('success', 'Photo uploaded. Add details and publish.');
      } catch (err) {
        handleMutationError(err);
      } finally {
        setGalleryUploading(false);
      }
    };
    reader.onerror = () => {
      setGalleryUploading(false);
      notify('error', 'Could not read that file.');
    };
    reader.readAsDataURL(file);
  };

  const deleteGalleryMut = useMutation({
    mutationFn: (id: string) => adminDeleteGalleryImage(token as string, id),
    onSuccess: () => {
      notify('success', 'Gallery photo removed.');
      invalidateAll();
    },
    onError: handleMutationError,
  });

  const createTestMut = useMutation({
    mutationFn: () =>
      adminCreateTestimonial(token as string, { ...newTestimonial, isFeatured: true }),
    onSuccess: () => {
      notify('success', 'Testimonial published.');
      setNewTestimonial((prev) => ({ ...prev, authorName: '', quote: '' }));
      invalidateAll();
    },
    onError: handleMutationError,
  });

  const deleteTestMut = useMutation({
    mutationFn: (id: string) => adminDeleteTestimonial(token as string, id),
    onSuccess: () => {
      notify('success', 'Testimonial removed.');
      invalidateAll();
    },
    onError: handleMutationError,
  });

  const markReadMut = useMutation({
    mutationFn: (id: string) => adminMarkMessageRead(token as string, id),
    onSuccess: () => {
      notify('success', 'Message marked as read.');
      invalidateAll();
    },
    onError: handleMutationError,
  });

  const deleteMessageMut = useMutation({
    mutationFn: (id: string) => adminDeleteMessage(token as string, id),
    onSuccess: () => {
      notify('success', 'Message deleted.');
      invalidateAll();
    },
    onError: handleMutationError,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    try {
      const res = await adminLogin({ email, password });
      setToken(res.token);
      sessionStorage.setItem('hab-admin-jwt', res.token);
      setPassword('');
    } catch (err) {
      setLoginError(errorMessage(err));
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setPassword('');
    try {
      sessionStorage.removeItem('hab-admin-jwt');
    } catch {
      // ignore
    }
  };

  const startEditing = (item: MenuItemInput & { id: string }) => {
    setEditingMenuId(item.id);
    setMenuForm({
      name: item.name,
      description: item.description,
      priceNpr: String(item.priceNpr),
      imageUrl: item.imageUrl,
      categorySlug: item.categorySlug,
      originNote: item.originNote,
      isFeatured: item.isFeatured,
      isAvailable: item.isAvailable,
    });
    menuFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!token || (error instanceof ApiError && error.status === 401)) {
    return (
      <div className="py-12 min-h-screen bg-crema dark:bg-espresso text-espresso dark:text-snow flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl bg-[#EFE0CC] dark:bg-roasted/70 border border-mocha/15 dark:border-crema/10 p-8 shadow-lg">
          <p className="text-xs font-medium tracking-widest text-caramel">Cafe Management</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold">Admin Sign In</h1>
          <p className="mt-2 text-sm text-roasted/80 dark:text-crema/75">
            Sign in with your administrator credentials to manage menu items, gallery photos,
            testimonials, and contact inquiries.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium mb-1">
                Admin Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-snow dark:bg-espresso/80 border border-mocha/20 dark:border-crema/15 px-3.5 py-2.5 text-sm focus:border-caramel focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full rounded-xl bg-snow dark:bg-espresso/80 border border-mocha/20 dark:border-crema/15 px-3.5 py-2.5 pr-11 text-sm focus:border-caramel focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-mocha dark:text-crema/60 hover:text-caramel transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {loginError && (
              <p role="alert" className="text-xs text-rose-600 dark:text-rose-300">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full rounded-xl bg-caramel px-5 py-3 text-sm font-semibold text-espresso hover:bg-caramel/90 transition-colors cursor-pointer disabled:opacity-60"
            >
              {loggingIn ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-5 text-xs text-roasted/70 dark:text-crema/60">
            Access is limited to the cafe owner. Contact the site administrator if you need
            credentials.
          </p>

          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-caramel hover:text-espresso dark:hover:text-snow transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to homepage
          </Link>
        </div>
      </div>
    );
  }

  const stats = data?.stats;
  const unreadCount = stats?.unreadMessages ?? 0;

  return (
    <div className="py-10 sm:py-14 min-h-screen bg-crema dark:bg-espresso text-espresso dark:text-snow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
          <SectionTitle
            title="Himalayan Arabica Admin"
            subtitle="Update coffee & pastry offerings, curate gallery photography, manage testimonials, and review guest messages."
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 rounded-xl border border-mocha/25 dark:border-crema/20 px-4 py-2.5 text-sm font-medium hover:border-caramel hover:text-caramel transition-colors disabled:opacity-60"
            >
              {isFetching ? 'Refreshing…' : 'Refresh'}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-mocha/25 dark:border-crema/20 px-4 py-2.5 text-sm font-medium hover:border-caramel hover:text-caramel transition-colors"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
            {[
              { label: 'Menu items', value: stats.menuItems, icon: Coffee },
              { label: 'Featured', value: stats.featuredItems, icon: Star },
              { label: 'Sold out', value: stats.soldOutItems, icon: X },
              { label: 'Gallery', value: stats.galleryImages, icon: Images },
              { label: 'Unread', value: stats.unreadMessages, icon: MessageSquare },
              { label: 'Subscribers', value: stats.newsletterSubscribers, icon: Users },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-xl bg-[#EFE0CC] dark:bg-roasted/65 border border-mocha/15 dark:border-crema/10 px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] uppercase tracking-wide text-roasted/65 dark:text-crema/60">
                      {stat.label}
                    </p>
                    <Icon className="w-3.5 h-3.5 text-caramel" aria-hidden="true" />
                  </div>
                  <p className="mt-1 font-serif text-2xl font-semibold tabular-nums">{stat.value}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(
            [
              { id: 'menu', label: `Menu (${data?.menuItems.length ?? 0})` },
              { id: 'gallery', label: `Gallery (${data?.galleryImages.length ?? 0})` },
              { id: 'testimonials', label: `Testimonials (${data?.testimonials.length ?? 0})` },
              {
                id: 'messages',
                label: `Messages (${data?.contactMessages.length ?? 0})${
                  unreadCount > 0 ? ` · ${unreadCount} new` : ''
                }`,
              },
              { id: 'subscribers', label: `Subscribers (${stats?.newsletterSubscribers ?? 0})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                activeTab === tab.id
                  ? 'bg-caramel text-espresso font-semibold'
                  : 'bg-[#E8D5BC] dark:bg-roasted/60 hover:text-caramel'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="h-64 rounded-2xl bg-roasted/15 dark:bg-roasted/50 animate-pulse" />
        ) : error ? (
          <div className="rounded-2xl border border-rose-400/30 p-8 text-center">
            <p className="font-medium">Could not load the admin dashboard.</p>
            <p className="mt-1 text-sm text-roasted/70 dark:text-crema/70">{errorMessage(error)}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-xl bg-caramel px-5 py-2 text-sm font-semibold text-espresso"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {/* MENU TAB */}
            {activeTab === 'menu' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <form
                  ref={menuFormRef}
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveMenuMut.mutate();
                  }}
                  className="lg:col-span-4 rounded-2xl bg-[#EFE0CC] dark:bg-roasted/65 border border-mocha/15 dark:border-crema/10 p-6 space-y-4 h-fit lg:sticky lg:top-24"
                >
                  <h2 className="font-serif text-xl font-semibold flex items-center gap-2">
                    {editingMenuId ? (
                      <Pencil className="w-5 h-5 text-caramel" aria-hidden="true" />
                    ) : (
                      <Plus className="w-5 h-5 text-caramel" aria-hidden="true" />
                    )}
                    <span>{editingMenuId ? 'Edit Menu Item' : 'Add Menu Item'}</span>
                  </h2>

                  <input
                    required
                    placeholder="Item name"
                    value={menuForm.name}
                    onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                    className="w-full rounded-xl bg-snow dark:bg-espresso/80 border border-mocha/20 dark:border-crema/15 px-3.5 py-2.5 text-sm"
                  />
                  <textarea
                    required
                    rows={3}
                    placeholder="Tasting notes / description"
                    value={menuForm.description}
                    onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                    className="w-full rounded-xl bg-snow dark:bg-espresso/80 border border-mocha/20 dark:border-crema/15 px-3.5 py-2.5 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      required
                      type="number"
                      min={50}
                      placeholder="Price (NPR)"
                      value={menuForm.priceNpr}
                      onChange={(e) => setMenuForm({ ...menuForm, priceNpr: e.target.value })}
                      className="w-full rounded-xl bg-snow dark:bg-espresso/80 border border-mocha/20 dark:border-crema/15 px-3.5 py-2.5 text-sm tabular-nums"
                    />
                    <select
                      value={menuForm.categorySlug}
                      onChange={(e) => setMenuForm({ ...menuForm, categorySlug: e.target.value })}
                      className="w-full rounded-xl bg-snow dark:bg-espresso/80 border border-mocha/20 dark:border-crema/15 px-3 py-2.5 text-sm"
                    >
                      {(data?.categories ?? []).map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    placeholder="Origin or roast note"
                    value={menuForm.originNote}
                    onChange={(e) => setMenuForm({ ...menuForm, originNote: e.target.value })}
                    className="w-full rounded-xl bg-snow dark:bg-espresso/80 border border-mocha/20 dark:border-crema/15 px-3.5 py-2.5 text-sm"
                  />
                  <input
                    required
                    placeholder="Image URL or /src/assets path"
                    value={menuForm.imageUrl}
                    onChange={(e) => setMenuForm({ ...menuForm, imageUrl: e.target.value })}
                    className="w-full rounded-xl bg-snow dark:bg-espresso/80 border border-mocha/20 dark:border-crema/15 px-3.5 py-2.5 text-sm"
                  />
                  {menuForm.imageUrl && (
                    <img
                      src={menuForm.imageUrl}
                      alt="Menu item preview"
                      className="h-28 w-full rounded-xl object-cover border border-mocha/15 dark:border-crema/10"
                    />
                  )}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={menuForm.isFeatured}
                        onChange={(e) =>
                          setMenuForm({ ...menuForm, isFeatured: e.target.checked })
                        }
                        className="accent-caramel"
                      />
                      <span>Feature on Home</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={menuForm.isAvailable}
                        onChange={(e) =>
                          setMenuForm({ ...menuForm, isAvailable: e.target.checked })
                        }
                        className="accent-caramel"
                      />
                      <span>Available</span>
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={saveMenuMut.isPending}
                      className="flex-1 rounded-xl bg-caramel px-4 py-2.5 text-sm font-semibold text-espresso hover:bg-caramel/90 cursor-pointer disabled:opacity-60"
                    >
                      {saveMenuMut.isPending
                        ? 'Saving...'
                        : editingMenuId
                          ? 'Save Changes'
                          : 'Add to Menu'}
                    </button>
                    {editingMenuId && (
                      <button
                        type="button"
                        onClick={resetMenuForm}
                        className="rounded-xl border border-mocha/25 dark:border-crema/20 px-4 py-2.5 text-sm font-medium hover:border-caramel transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                <div className="lg:col-span-8 space-y-3">
                  {(data?.menuItems ?? []).length === 0 && (
                    <p className="text-sm text-roasted/70 dark:text-crema/70">No menu items yet.</p>
                  )}
                  {(data?.menuItems ?? []).map((item) => (
                    <div
                      key={item.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-[#EFE0CC] dark:bg-roasted/65 border p-4 ${
                        editingMenuId === item.id
                          ? 'border-caramel/60'
                          : 'border-mocha/15 dark:border-crema/10'
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="font-serif text-lg font-semibold truncate">{item.name}</h3>
                          <p className="text-xs text-mocha dark:text-caramel tabular-nums">
                            NPR {item.priceNpr.toLocaleString('en-NP')} · {item.categorySlug} ·{' '}
                            {item.isAvailable ? 'Available' : 'Unavailable'}
                            {item.isFeatured ? ' · Featured' : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => startEditing(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-mocha/25 dark:border-crema/20 text-xs font-medium hover:border-caramel hover:text-caramel cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            toggleMenuMut.mutate({
                              id: item.id,
                              isAvailable: !item.isAvailable,
                            })
                          }
                          className="px-3 py-1.5 rounded-lg border border-mocha/25 dark:border-crema/20 text-xs font-medium hover:border-caramel cursor-pointer"
                        >
                          {item.isAvailable ? 'Mark Sold Out' : 'Restore'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete "${item.name}" from the menu?`)) {
                              deleteMenuMut.mutate(item.id);
                            }
                          }}
                          aria-label={`Delete ${item.name}`}
                          className="p-2 rounded-lg text-rose-600 dark:text-rose-300 hover:bg-rose-500/15 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GALLERY TAB */}
            {activeTab === 'gallery' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    createGalleryMut.mutate();
                  }}
                  className="lg:col-span-4 rounded-2xl bg-[#EFE0CC] dark:bg-roasted/65 border border-mocha/15 dark:border-crema/10 p-6 space-y-4 h-fit"
                >
                  <h2 className="font-serif text-xl font-semibold">Add Gallery Photo</h2>
                  <input
                    required
                    placeholder="Title"
                    value={newGallery.title}
                    onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                    className="w-full rounded-xl bg-snow dark:bg-espresso/80 border border-mocha/20 dark:border-crema/15 px-3.5 py-2.5 text-sm"
                  />
                  <input
                    required
                    placeholder="Category (e.g. Barista Training)"
                    value={newGallery.category}
                    onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value })}
                    className="w-full rounded-xl bg-snow dark:bg-espresso/80 border border-mocha/20 dark:border-crema/15 px-3.5 py-2.5 text-sm"
                  />
                  <textarea
                    required
                    rows={3}
                    placeholder="Caption"
                    value={newGallery.caption}
                    onChange={(e) => setNewGallery({ ...newGallery, caption: e.target.value })}
                    className="w-full rounded-xl bg-snow dark:bg-espresso/80 border border-mocha/20 dark:border-crema/15 px-3.5 py-2.5 text-sm"
                  />
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (!galleryUploading) setGalleryDragging(true);
                    }}
                    onDragLeave={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                        setGalleryDragging(false);
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setGalleryDragging(false);
                      if (galleryUploading) return;
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleGalleryFile(file);
                    }}
                    className={`rounded-xl border-2 border-dashed p-4 text-center transition-colors ${
                      galleryDragging
                        ? 'border-caramel bg-caramel/10'
                        : 'border-mocha/30 dark:border-crema/20 bg-snow/70 dark:bg-espresso/50'
                    }`}
                  >
                    {newGallery.imageUrl ? (
                      <div className="space-y-3">
                        <img
                          src={newGallery.imageUrl}
                          alt="Selected gallery preview"
                          className="h-40 w-full rounded-lg object-cover"
                        />
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            disabled={galleryUploading}
                            onClick={() => galleryFileRef.current?.click()}
                            className="rounded-lg border border-mocha/25 dark:border-crema/20 px-3 py-1.5 text-xs font-medium hover:border-caramel hover:text-caramel transition-colors cursor-pointer disabled:opacity-60"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            disabled={galleryUploading}
                            onClick={() =>
                              setNewGallery((prev) => ({ ...prev, imageUrl: '' }))
                            }
                            className="rounded-lg border border-rose-500/30 px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-60"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={galleryUploading}
                        onClick={() => galleryFileRef.current?.click()}
                        className="w-full py-5 cursor-pointer disabled:cursor-wait"
                      >
                        {galleryUploading ? (
                          <Loader2 className="mx-auto h-6 w-6 animate-spin text-caramel" />
                        ) : (
                          <UploadCloud className="mx-auto h-6 w-6 text-caramel" />
                        )}
                        <span className="mt-2 block text-sm font-semibold">
                          {galleryUploading
                            ? 'Uploading photo...'
                            : galleryDragging
                              ? 'Drop the photo here'
                              : 'Drag & drop a photo'}
                        </span>
                        <span className="mt-1 block text-xs text-roasted/60 dark:text-crema/50">
                          or click to browse · JPG, PNG, WebP up to 5 MB
                        </span>
                      </button>
                    )}
                    <input
                      ref={galleryFileRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                      disabled={galleryUploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleGalleryFile(file);
                        e.target.value = '';
                      }}
                      className="sr-only"
                    />
                  </div>
                  <input
                    placeholder="Or paste an image URL"
                    value={newGallery.imageUrl}
                    onChange={(e) => setNewGallery({ ...newGallery, imageUrl: e.target.value })}
                    className="w-full rounded-xl bg-snow dark:bg-espresso/80 border border-mocha/20 dark:border-crema/15 px-3.5 py-2.5 text-sm"
                  />
                  <select
                    value={newGallery.aspectRatio}
                    onChange={(e) =>
                      setNewGallery({
                        ...newGallery,
                        aspectRatio: e.target.value as 'landscape' | 'portrait' | 'square',
                      })
                    }
                    className="w-full rounded-xl bg-snow dark:bg-espresso/80 border border-mocha/20 dark:border-crema/15 px-3 py-2.5 text-sm"
                  >
                    <option value="landscape">Landscape</option>
                    <option value="portrait">Portrait</option>
                    <option value="square">Square</option>
                  </select>
                  <button
                    type="submit"
                    disabled={
                      createGalleryMut.isPending || galleryUploading || !newGallery.imageUrl
                    }
                    className="w-full rounded-xl bg-caramel px-4 py-2.5 text-sm font-semibold text-espresso cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {createGalleryMut.isPending ? 'Saving...' : 'Add Photo'}
                  </button>
                </form>

                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(data?.galleryImages ?? []).map((img) => (
                    <div
                      key={img.id}
                      className="rounded-2xl overflow-hidden bg-[#EFE0CC] dark:bg-roasted/65 border border-mocha/15 dark:border-crema/10"
                    >
                      <img
                        src={img.imageUrl}
                        alt={img.title}
                        className="h-44 w-full object-cover"
                      />
                      <div className="p-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-serif font-semibold">{img.title}</p>
                          <p className="text-xs text-caramel">{img.category}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete the photo "${img.title}"?`)) {
                              deleteGalleryMut.mutate(img.id);
                            }
                          }}
                          aria-label={`Delete ${img.title}`}
                          className="p-2 rounded-lg text-rose-600 dark:text-rose-300 hover:bg-rose-500/15 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TESTIMONIALS TAB */}
            {activeTab === 'testimonials' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    createTestMut.mutate();
                  }}
                  className="lg:col-span-4 rounded-2xl bg-[#EFE0CC] dark:bg-roasted/65 border border-mocha/15 dark:border-crema/10 p-6 space-y-4 h-fit"
                >
                  <h2 className="font-serif text-xl font-semibold">Add Testimonial</h2>
                  <input
                    required
                    placeholder="Guest name"
                    value={newTestimonial.authorName}
                    onChange={(e) =>
                      setNewTestimonial({ ...newTestimonial, authorName: e.target.value })
                    }
                    className="w-full rounded-xl bg-snow dark:bg-espresso/80 border border-mocha/20 dark:border-crema/15 px-3.5 py-2.5 text-sm"
                  />
                  <input
                    required
                    placeholder="Role / traveler title"
                    value={newTestimonial.authorRole}
                    onChange={(e) =>
                      setNewTestimonial({ ...newTestimonial, authorRole: e.target.value })
                    }
                    className="w-full rounded-xl bg-snow dark:bg-espresso/80 border border-mocha/20 dark:border-crema/15 px-3.5 py-2.5 text-sm"
                  />
                  <input
                    required
                    placeholder="City / Country"
                    value={newTestimonial.origin}
                    onChange={(e) =>
                      setNewTestimonial({ ...newTestimonial, origin: e.target.value })
                    }
                    className="w-full rounded-xl bg-snow dark:bg-espresso/80 border border-mocha/20 dark:border-crema/15 px-3.5 py-2.5 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={newTestimonial.rating}
                      onChange={(e) =>
                        setNewTestimonial({ ...newTestimonial, rating: Number(e.target.value) })
                      }
                      aria-label="Rating"
                      className="w-full rounded-xl bg-snow dark:bg-espresso/80 border border-mocha/20 dark:border-crema/15 px-3 py-2.5 text-sm"
                    >
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <option key={rating} value={rating}>
                          {rating} star{rating === 1 ? '' : 's'}
                        </option>
                      ))}
                    </select>
                    <input
                      required
                      placeholder="Visit date"
                      value={newTestimonial.visitDate}
                      onChange={(e) =>
                        setNewTestimonial({ ...newTestimonial, visitDate: e.target.value })
                      }
                      className="w-full rounded-xl bg-snow dark:bg-espresso/80 border border-mocha/20 dark:border-crema/15 px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <textarea
                    required
                    rows={3}
                    placeholder="Guest quote"
                    value={newTestimonial.quote}
                    onChange={(e) =>
                      setNewTestimonial({ ...newTestimonial, quote: e.target.value })
                    }
                    className="w-full rounded-xl bg-snow dark:bg-espresso/80 border border-mocha/20 dark:border-crema/15 px-3.5 py-2.5 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={createTestMut.isPending}
                    className="w-full rounded-xl bg-caramel px-4 py-2.5 text-sm font-semibold text-espresso cursor-pointer disabled:opacity-60"
                  >
                    {createTestMut.isPending ? 'Saving...' : 'Publish Testimonial'}
                  </button>
                </form>

                <div className="lg:col-span-8 space-y-4">
                  {(data?.testimonials ?? []).map((t) => (
                    <div
                      key={t.id}
                      className="rounded-2xl bg-[#EFE0CC] dark:bg-roasted/65 border border-mocha/15 dark:border-crema/10 p-5 flex items-start justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-1 mb-1" aria-label={`${t.rating} star rating`}>
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="w-3.5 h-3.5 fill-caramel text-caramel"
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                        <p className="font-serif text-lg">“{t.quote}”</p>
                        <p className="mt-2 text-xs text-caramel">
                          {t.authorName} · {t.authorRole} · {t.origin} · {t.visitDate}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete the testimonial by ${t.authorName}?`)) {
                            deleteTestMut.mutate(t.id);
                          }
                        }}
                        aria-label={`Delete testimonial by ${t.authorName}`}
                        className="p-2 rounded-lg text-rose-600 dark:text-rose-300 hover:bg-rose-500/15 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CONTACT MESSAGES TAB */}
            {activeTab === 'messages' && (
              <div className="space-y-4">
                {(data?.contactMessages ?? []).length === 0 ? (
                  <p className="text-sm text-roasted/70 dark:text-crema/70">
                    No contact messages received yet.
                  </p>
                ) : (
                  (data?.contactMessages ?? []).map((msg) => (
                    <div
                      key={msg.id}
                      className={`rounded-2xl bg-[#EFE0CC] dark:bg-roasted/65 border p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                        msg.status === 'unread'
                          ? 'border-caramel/50'
                          : 'border-mocha/15 dark:border-crema/10'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-caramel">
                          {msg.status === 'unread' ? 'Unread Inquiry' : 'Reviewed'} ·{' '}
                          {new Date(msg.createdAt).toLocaleString()}
                        </p>
                        <h3 className="mt-1 font-serif text-xl font-semibold">{msg.subject}</h3>
                        <p className="text-xs text-roasted/75 dark:text-crema/75 mt-0.5">
                          From {msg.name} ·{' '}
                          <a
                            href={`mailto:${msg.email}?subject=${encodeURIComponent(
                              `Re: ${msg.subject}`
                            )}`}
                            className="text-mocha dark:text-caramel hover:underline"
                          >
                            {msg.email}
                          </a>
                        </p>
                        <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">
                          {msg.message}
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center gap-2 shrink-0">
                        {msg.status === 'unread' && (
                          <button
                            type="button"
                            onClick={() => markReadMut.mutate(msg.id)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-himalayan px-3.5 py-2 text-xs font-semibold text-snow cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Mark Read</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Delete this contact message permanently?')) {
                              deleteMessageMut.mutate(msg.id);
                            }
                          }}
                          aria-label={`Delete message from ${msg.name}`}
                          className="p-2 rounded-lg text-rose-600 dark:text-rose-300 hover:bg-rose-500/15 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* SUBSCRIBERS TAB */}
            {activeTab === 'subscribers' && (
              <div className="rounded-2xl bg-[#EFE0CC] dark:bg-roasted/65 border border-mocha/15 dark:border-crema/10 overflow-hidden">
                {(data?.newsletterSubscribers ?? []).length === 0 ? (
                  <p className="p-6 text-sm text-roasted/70 dark:text-crema/70">
                    No newsletter subscribers yet.
                  </p>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-espresso/5 dark:bg-espresso/40 text-left text-xs uppercase tracking-wide text-roasted/65 dark:text-crema/60">
                      <tr>
                        <th className="px-5 py-3 font-medium">Email</th>
                        <th className="px-5 py-3 font-medium">Subscribed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data?.newsletterSubscribers ?? []).map((sub) => (
                        <tr
                          key={sub.id}
                          className="border-t border-mocha/10 dark:border-crema/10"
                        >
                          <td className="px-5 py-3 break-all">
                            <a
                              href={`mailto:${sub.email}`}
                              className="text-mocha dark:text-caramel hover:underline"
                            >
                              {sub.email}
                            </a>
                          </td>
                          <td className="px-5 py-3 text-xs text-roasted/70 dark:text-crema/70 whitespace-nowrap">
                            {new Date(sub.subscribedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[95] rounded-xl px-5 py-3 text-sm font-medium shadow-xl border ${
            toast.type === 'success'
              ? 'bg-himalayan text-snow border-himalayan'
              : 'bg-rose-600 text-white border-rose-700'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
