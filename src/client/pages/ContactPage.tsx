import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, CheckCircle2, Clock, Copy, Mail, MapPin, MessageCircle, Navigation, Phone, Send } from 'lucide-react';
import { submitContactForm } from '../lib/api';
import { Reveal, SectionTitle } from '../components/Reveal';
import { ThamelMap } from '../components/ThamelMap';
import { OpenStatusBadge } from '../components/OpenStatusBadge';
import { usePageMeta } from '../hooks/usePageMeta';

const ADDRESS = 'Saat Ghumti Marg, Thamel, Kathmandu 44600, Nepal';
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=27.7153706,85.3088386';
const WHATSAPP_URL = 'https://wa.me/9779860199935';

const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name (at least 2 characters)'),
  email: z.string().trim().email('Please enter a valid email address'),
  subject: z.string().trim().min(3, 'Please enter a subject'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters'),
  honeypot: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactPage() {
  usePageMeta(
    'Contact & Directions – Himalayan Arabica Beans, Thamel',
    'Find Himalayan Arabica Beans on Saat Ghumti Marg in Thamel, Kathmandu. Call, WhatsApp or send a message about coffee beans, barista training and reservations.'
  );

  const [submitState, setSubmitState] = useState<{
    type: 'idle' | 'success' | 'error';
    message?: string;
  }>({ type: 'idle' });
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitState({ type: 'idle' });
    try {
      const res = await submitContactForm(values);
      setSubmitState({ type: 'success', message: res.message });
      reset();
    } catch (err) {
      setSubmitState({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to send message.',
      });
    }
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(ADDRESS);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-crema dark:bg-espresso text-espresso dark:text-snow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <SectionTitle
            kicker="Visit or Message Us"
            title="Find Himalayan Arabica Beans in Thamel"
            subtitle="Stop by Saat Ghumti Marg for fresh coffee and pastries, inquire about our 15-day barista training, or order roasted Nepali Arabica beans."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Info & Map */}
          <Reveal className="lg:col-span-6 space-y-6">
            <div className="rounded-2xl bg-[#EFE0CC] dark:bg-roasted/65 border border-mocha/15 dark:border-crema/10 p-6 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
                <OpenStatusBadge showDetail />
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-mocha dark:text-caramel hover:underline underline-offset-4"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  <span>{copied ? 'Address copied' : 'Copy address'}</span>
                </button>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-caramel shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <h3 className="font-serif text-lg font-semibold">Address</h3>
                  <p className="text-sm text-roasted/85 dark:text-crema/80 mt-0.5">{ADDRESS}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-caramel shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <h3 className="font-serif text-lg font-semibold">Opening Hours</h3>
                  <p className="text-sm text-roasted/85 dark:text-crema/80 mt-0.5">
                    Monday – Sunday · 7:00 AM – 9:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-caramel shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <h3 className="font-serif text-lg font-semibold">Phone</h3>
                  <p className="text-sm text-roasted/85 dark:text-crema/80 mt-0.5 tabular-nums">
                    01-4700000 · +977 9860199935 · +977 9851117547
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-caramel shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <h3 className="font-serif text-lg font-semibold">Email</h3>
                  <a
                    href="mailto:himalayanarabicabeans@gmail.com"
                    className="text-sm text-mocha dark:text-caramel hover:underline mt-0.5 inline-block"
                  >
                    himalayanarabicabeans@gmail.com
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-mocha/15 dark:border-crema/10">
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-espresso dark:bg-caramel px-3 py-2.5 text-xs sm:text-sm font-semibold text-snow dark:text-espresso hover:opacity-90 transition-opacity"
                >
                  <Navigation className="w-4 h-4" aria-hidden="true" />
                  Directions
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-himalayan/40 text-himalayan dark:text-emerald-300 px-3 py-2.5 text-xs sm:text-sm font-semibold hover:bg-himalayan/10 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  WhatsApp
                </a>
              </div>
            </div>

            <ThamelMap />
          </Reveal>

          {/* Contact Form */}
          <Reveal delay={0.12} className="lg:col-span-6">
            <div className="rounded-2xl bg-[#EFE0CC] dark:bg-roasted/65 border border-mocha/15 dark:border-crema/10 p-6 sm:p-8 shadow-sm">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold">Send a Message</h2>
              <p className="mt-2 text-sm text-roasted/80 dark:text-crema/75">
                Questions about wholesale Nepali beans, barista courses, or group reservations?
                Write to us directly.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register('honeypot')}
                  />
                </div>

                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    {...register('name')}
                    placeholder="Your name"
                    className="w-full rounded-xl bg-snow dark:bg-espresso/80 border border-mocha/20 dark:border-crema/15 px-4 py-3 text-sm text-espresso dark:text-snow focus:border-caramel focus:outline-none"
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-300">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    {...register('email')}
                    placeholder="you@example.com"
                    className="w-full rounded-xl bg-snow dark:bg-espresso/80 border border-mocha/20 dark:border-crema/15 px-4 py-3 text-sm text-espresso dark:text-snow focus:border-caramel focus:outline-none"
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-300">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-medium mb-1.5">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    {...register('subject')}
                    placeholder="Barista training, coffee beans, or table inquiry"
                    className="w-full rounded-xl bg-snow dark:bg-espresso/80 border border-mocha/20 dark:border-crema/15 px-4 py-3 text-sm text-espresso dark:text-snow focus:border-caramel focus:outline-none"
                  />
                  {errors.subject && (
                    <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-300">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    {...register('message')}
                    placeholder="Tell us how we can help..."
                    className="w-full rounded-xl bg-snow dark:bg-espresso/80 border border-mocha/20 dark:border-crema/15 px-4 py-3 text-sm text-espresso dark:text-snow focus:border-caramel focus:outline-none resize-y"
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-300">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {submitState.type === 'success' && (
                  <div
                    role="status"
                    className="flex items-start gap-2.5 rounded-xl bg-himalayan/15 border border-himalayan/30 p-3.5 text-sm text-himalayan dark:text-emerald-300"
                  >
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{submitState.message}</span>
                  </div>
                )}

                {submitState.type === 'error' && (
                  <div
                    role="alert"
                    className="rounded-xl bg-rose-500/15 border border-rose-400/30 p-3.5 text-sm text-rose-700 dark:text-rose-300"
                  >
                    {submitState.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-caramel px-6 py-3.5 text-sm font-semibold text-espresso hover:bg-caramel/90 transition-colors disabled:opacity-60 cursor-pointer"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
