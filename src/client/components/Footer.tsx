import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone, Send } from 'lucide-react';
import { subscribeNewsletter } from '../lib/api';
import { OpenStatusBadge } from './OpenStatusBadge';

export function Footer() {
  const prefersReducedMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message?: string }>({
    type: 'idle',
  });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus({ type: 'loading' });
    try {
      const res = await subscribeNewsletter(email.trim());
      setStatus({ type: 'success', message: res.message });
      setEmail('');
    } catch (err) {
      setStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Unable to subscribe right now.',
      });
    }
  };

  return (
    <footer className="relative bg-espresso text-snow pt-12 overflow-hidden border-t border-crema/10">
      {/* Animated Wave / Steam SVG Crest */}
      <div aria-hidden="true" className="w-full overflow-hidden -mt-12 mb-10">
        <motion.svg
          viewBox="0 0 1440 90"
          fill="none"
          preserveAspectRatio="none"
          className="w-[110%] -ml-[5%] h-14 sm:h-20 text-roasted/60"
          animate={
            prefersReducedMotion
              ? undefined
              : { x: ['0%', '-3%', '0%'] }
          }
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M0 45 C240 85 480 5 720 45 C960 85 1200 5 1440 45 V90 H0 Z"
            fill="currentColor"
          />
        </motion.svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="font-serif text-2xl font-semibold text-snow">
              Himalayan Arabica Beans
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-crema/75">
              One of the finest specialty coffee houses in Nepal, serving 100% organic Nepali
              Arabica beans from the Himalayas with 100+ fresh coffee flavors and artisan pastries
              since 2012.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.google.com/maps/search/?api=1&query=27.7153706,85.3088386"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get directions to Himalayan Arabica Beans on Google Maps"
                className="p-2.5 rounded-xl bg-roasted/70 border border-crema/10 text-crema hover:text-caramel hover:border-caramel/50 transition-colors"
              >
                <Navigation className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="https://wa.me/9779860199935"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Himalayan Arabica Beans on WhatsApp"
                className="p-2.5 rounded-xl bg-roasted/70 border border-crema/10 text-crema hover:text-caramel hover:border-caramel/50 transition-colors"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
              </a>
              <OpenStatusBadge forceDark />
            </div>
          </div>

          {/* Visit & Hours */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-snow">Visit Thamel</h3>
            <ul className="mt-4 space-y-3.5 text-sm text-crema/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-caramel shrink-0 mt-1" aria-hidden="true" />
                <span>Saat Ghumti Marg, Thamel, Kathmandu 44600, Nepal</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-caramel shrink-0 mt-1" aria-hidden="true" />
                <span>Open Daily: 7:00 AM – 9:00 PM</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-caramel shrink-0 mt-1" aria-hidden="true" />
                <span className="tabular-nums">01-4700000 / +977 9860199935</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-caramel shrink-0 mt-1" aria-hidden="true" />
                <a
                  href="mailto:himalayanarabicabeans@gmail.com"
                  className="hover:text-caramel transition-colors break-all"
                >
                  himalayanarabicabeans@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-snow">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-crema/80">
              <li>
                <Link to="/" className="hover:text-caramel transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-caramel transition-colors">
                  Our Story & Timeline
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-caramel transition-colors">
                  Coffee & Pastry Menu
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-caramel transition-colors">
                  Cafe & Barista Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-caramel transition-colors">
                  Contact & Directions
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-caramel transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-snow">Roast Dispatches</h3>
            <p className="mt-4 text-sm text-crema/75 leading-relaxed">
              Seasonal harvest notes from Ilam & Gorkha farms plus barista training batch dates.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 space-y-2.5">
              <label htmlFor="footer-newsletter" className="sr-only">
                Email address for newsletter
              </label>
              <div className="flex gap-2">
                <input
                  id="footer-newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-xl bg-roasted/80 border border-crema/15 px-3.5 py-2.5 text-sm text-snow placeholder:text-crema/45 focus:border-caramel focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={status.type === 'loading'}
                  aria-label="Subscribe to newsletter"
                  className="shrink-0 rounded-xl bg-caramel px-4 py-2.5 text-espresso font-semibold hover:bg-caramel/90 transition-colors disabled:opacity-60"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
              {status.message && (
                <p
                  role="status"
                  className={`text-xs ${
                    status.type === 'error' ? 'text-rose-300' : 'text-emerald-300'
                  }`}
                >
                  {status.message}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-crema/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-crema/60">
          <p>© {new Date().getFullYear()} Himalayan Arabica Beans · Thamel, Kathmandu.</p>
          <p>100% Organic Nepali Arabica · Crafted Since 2012</p>
        </div>
      </div>
    </footer>
  );
}
