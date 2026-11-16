import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, useReducedMotion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Coffee, ExternalLink, MapPin } from 'lucide-react';
import { fetchFeaturedMenu, fetchTestimonials } from '../lib/api';
import { MAPS_REVIEWS_URL } from '../lib/maps';
import {
  Counter,
  MagneticButton,
  Marquee,
  Reveal,
  SectionTitle,
  StaggerContainer,
  StaggerItem,
} from '../components/Reveal';
import { MountainDivider } from '../components/MountainDivider';
import { MenuCard } from '../components/MenuCard';
import { TestimonialCarousel } from '../components/TestimonialCarousel';
import { OpenStatusBadge } from '../components/OpenStatusBadge';
import { usePageMeta } from '../hooks/usePageMeta';

gsap.registerPlugin(ScrollTrigger);

const HERO_HEADLINE_WORDS = [
  '100%',
  'Himalayan',
  'Arabica,',
  'Brewed',
  'Fresh',
  'in',
  'Thamel.',
];

export function HomePage() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  usePageMeta(
    'Himalayan Arabica Beans – Specialty Coffee House in Thamel, Kathmandu',
    'Serving 100% organic Nepali Arabica coffee, 100+ coffee flavors, and freshly baked pastries in the heart of Thamel, Kathmandu since 2012.'
  );
  const heroRef = useRef<HTMLElement | null>(null);
  const mountainFarRef = useRef<HTMLDivElement | null>(null);
  const mountainNearRef = useRef<HTMLDivElement | null>(null);
  const beansLayerRef = useRef<HTMLDivElement | null>(null);

  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-menu'],
    queryFn: fetchFeaturedMenu,
  });

  const { data: testimonialsData } = useQuery({
    queryKey: ['testimonials'],
    queryFn: fetchTestimonials,
  });

  useEffect(() => {
    if (prefersReducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      if (mountainFarRef.current) {
        gsap.to(mountainFarRef.current, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
      if (mountainNearRef.current) {
        gsap.to(mountainNearRef.current, {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
      if (beansLayerRef.current) {
        gsap.to(beansLayerRef.current, {
          yPercent: -24,
          rotation: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const featuredItems = (featuredData?.items ?? []).slice(0, 6);
  const testimonials = testimonialsData?.testimonials ?? [];

  return (
    <div>
      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className="relative min-h-[94vh] flex items-center pt-28 pb-24 overflow-hidden bg-espresso text-snow"
      >
        {/* Background Hero Image with Measured Contrast Scrim */}
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/hero_himalayan_cafe_1794813060283.jpg"
            alt="Steaming latte art cup overlooking Himalayan peaks at sunrise"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center opacity-55"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-espresso/85 via-espresso/60 to-espresso"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-espresso/90 via-espresso/55 to-transparent"
          />
        </div>

        {/* Parallax Himalayan Mountain Silhouette Layers */}
        <div
          ref={mountainFarRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-8 opacity-30"
        >
          <svg viewBox="0 0 1440 240" fill="none" className="w-full h-44 sm:h-60 text-mocha">
            <path
              d="M0 240 L180 120 L340 175 L540 60 L740 165 L960 40 L1180 155 L1340 85 L1440 140 V240 Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div
          ref={mountainNearRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 opacity-65"
        >
          <svg viewBox="0 0 1440 180" fill="none" className="w-full h-32 sm:h-44 text-espresso">
            <path
              d="M0 180 L210 95 L380 145 L610 55 L820 135 L1040 48 L1240 128 L1440 72 V180 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Floating Coffee Beans & Animated Steam Layer */}
        <div
          ref={beansLayerRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {[
            { top: '22%', right: '14%', size: 28, delay: 0 },
            { top: '36%', right: '7%', size: 22, delay: 0.7 },
            { top: '64%', right: '18%', size: 26, delay: 1.3 },
          ].map((bean, i) => (
            <motion.svg
              key={i}
              width={bean.size}
              height={bean.size * 1.3}
              viewBox="0 0 24 32"
              fill="none"
              style={{ top: bean.top, right: bean.right }}
              className="absolute hidden md:block opacity-45"
              animate={
                prefersReducedMotion
                  ? undefined
                  : { y: [-8, 10, -8], rotate: [-12, 14, -12] }
              }
              transition={{
                duration: 6 + i,
                delay: bean.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <ellipse cx="12" cy="16" rx="9" ry="13" fill="#6F4E37" stroke="#C8872E" strokeWidth="1.2" />
              <path d="M12 4.5C9.5 10.5 14.5 21.5 12 27.5" stroke="#1C110A" strokeWidth="1.6" />
            </motion.svg>
          ))}
        </div>

        {/* Hero Foreground Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8">
              <p className="text-xs sm:text-sm font-medium tracking-widest text-caramel">
                Saat Ghumti Marg · Thamel, Kathmandu · Since 2012
              </p>

              <div className="mt-3">
                <OpenStatusBadge showDetail forceDark />
              </div>

              <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] font-semibold leading-[1.1] text-snow max-w-3xl">
                {HERO_HEADLINE_WORDS.map((word, idx) => (
                  <motion.span
                    key={idx}
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: prefersReducedMotion ? 0 : 0.12 + idx * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block mr-[0.28em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : 0.55 }}
                className="mt-6 text-base sm:text-lg leading-relaxed text-crema/85 max-w-2xl"
              >
                One of the finest coffee houses in Nepal—serving 100% organic Nepali Arabica beans
                from the Himalayas across 100+ fresh coffee flavors alongside warm morning pastries.
              </motion.p>

              <motion.div
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: prefersReducedMotion ? 0 : 0.7 }}
                className="mt-9 flex flex-wrap items-center gap-4"
              >
                <MagneticButton
                  onClick={() => navigate('/menu')}
                  className="inline-flex items-center gap-2.5 rounded-xl bg-caramel px-6 py-3.5 text-sm sm:text-base font-semibold text-espresso shadow-lg hover:bg-caramel/90 transition-colors cursor-pointer"
                >
                  <span>Explore 100+ Flavors</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </MagneticButton>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-crema/25 bg-roasted/45 backdrop-blur-md px-5 py-3.5 text-sm sm:text-base font-medium text-snow hover:border-caramel hover:text-caramel transition-colors"
                >
                  <MapPin className="w-4 h-4 text-caramel" aria-hidden="true" />
                  <span>Find Us in Thamel</span>
                </Link>
              </motion.div>
            </div>

            {/* Subtle Glassmorphism Steam Accent Card on Desktop */}
            <div className="hidden lg:flex lg:col-span-4 justify-end">
              <motion.div
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: prefersReducedMotion ? 0 : 0.6 }}
                className="relative rounded-2xl bg-roasted/55 backdrop-blur-md border border-crema/15 p-6 max-w-xs w-full shadow-2xl"
              >
                {/* Animated rising steam above cup icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-espresso/70 border border-caramel/30">
                    <Coffee className="w-6 h-6 text-caramel" aria-hidden="true" />
                    {!prefersReducedMotion && (
                      <motion.span
                        aria-hidden="true"
                        animate={{ opacity: [0, 0.7, 0], y: [0, -14] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                        className="absolute -top-2 w-1.5 h-4 rounded-full bg-crema/50 blur-[1px]"
                      />
                    )}
                  </div>
                  <span className="text-xs font-medium text-caramel tabular-nums">
                    Open 7 AM – 9 PM
                  </span>
                </div>

                <h2 className="font-serif text-xl font-semibold text-snow">
                  Fresh Himalayan Roast
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-crema/80">
                  Hand-picked Nepali Arabica from Ilam, Gulmi, and Gorkha highlands—roasted to
                  order and pulled fresh all day.
                </p>
                <div className="mt-4 pt-4 border-t border-crema/10 flex items-center justify-between text-xs text-crema/70">
                  <span>Saat Ghumti Marg</span>
                  <span>Est. 2012</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE STRIP */}
      <Marquee
        items={[
          '100% Organic Nepali Arabica',
          '100+ Fresh Coffee Flavors',
          'Opened 2012 in Thamel',
          'Fresh Artisan Pastries Daily',
          '15-Day Barista Training Academy',
          'Saat Ghumti Marg, Kathmandu',
        ]}
      />

      {/* ABOUT SNIPPET (Light/Dark Alternating Surface) */}
      <section className="relative bg-crema dark:bg-roasted/35 text-espresso dark:text-snow py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <Reveal className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] bg-roasted/20">
                <img
                  src="/src/assets/images/about_thamel_roastery_1794813060860.jpg"
                  alt="Barista pulling espresso at Himalayan Arabica Beans in Thamel, Kathmandu"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
            </Reveal>

            <div className="lg:col-span-6">
              <SectionTitle
                kicker="Our Story · Since 2012"
                title="Born in the Heart of Thamel for Coffee Lovers Worldwide"
                subtitle="Himalayan Arabica Beans opened in 2012 in Kathmandu’s vibrant tourist quarter to introduce visiting trekkers and locals to pure, high-altitude Nepali Arabica coffee."
              />
              <Reveal delay={0.15}>
                <p className="mt-5 text-sm sm:text-base leading-relaxed text-roasted/80 dark:text-crema/80">
                  Every cup begins on terraced Himalayan hillsides between 1,200 and 1,900 meters.
                  From classic double espressos to over 100 house-crafted flavor creations and
                  warm morning croissants, our roastery and espresso bar welcome you every day from
                  dawn until evening.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 rounded-xl bg-espresso dark:bg-caramel px-5 py-3 text-sm font-semibold text-snow dark:text-espresso hover:opacity-90 transition-opacity"
                  >
                    <span>Explore Our Journey</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                  <Link
                    to="/gallery"
                    className="text-sm font-medium text-mocha dark:text-caramel hover:underline underline-offset-4"
                  >
                    View Cafe Gallery
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <MountainDivider
        topColorClass="bg-crema dark:bg-roasted/35"
        fillClass="text-snow dark:text-espresso"
      />

      {/* SIGNATURE COFFEES & PASTRIES */}
      <section className="bg-snow dark:bg-espresso text-espresso dark:text-snow py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <SectionTitle
              kicker="Signature Selection"
              title="Crafted Coffees & Morning Pastries"
              subtitle="Highlights from our 100+ coffee varieties and daily Thamel bakery counter."
            />
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-sm font-semibold text-caramel hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              <span>See Full Menu</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[0, 1, 2].map((skeleton) => (
                <div
                  key={skeleton}
                  className="h-96 rounded-2xl bg-crema/70 dark:bg-roasted/40 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredItems.map((item) => (
                <StaggerItem key={item.id}>
                  <MenuCard item={item} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* STATS BAND */}
      <section className="relative bg-roasted text-snow py-16 sm:py-20 grain-overlay border-y border-crema/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { target: 100, suffix: '+', label: 'Fresh Coffee Flavors' },
              { target: 2012, suffix: '', label: 'Opened in Thamel' },
              { target: 100, suffix: '%', label: 'Nepali Himalayan Arabica' },
              { target: 15, suffix: ' Days', label: 'Barista Training Course' },
            ].map((stat, idx) => (
              <Reveal key={idx} delay={idx * 0.08} className="p-4">
                <p className="font-serif text-4xl sm:text-5xl font-semibold text-caramel">
                  <Counter target={stat.target} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-xs sm:text-sm text-crema/80 tracking-wide">
                  {stat.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-crema dark:bg-espresso text-espresso dark:text-snow py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <SectionTitle
              align="center"
              kicker="Guest Voices"
              title="Stories From Trekkers, Travelers & Baristas"
              subtitle="Drag or click through reflections from guests who made our Thamel cafe part of their Kathmandu journey."
            />
          </div>
          <TestimonialCarousel testimonials={testimonials} />
          <div className="mt-10 flex justify-center">
            <a
              href={MAPS_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-mocha/25 dark:border-crema/20 px-5 py-2.5 text-sm font-semibold text-espresso dark:text-crema hover:border-caramel hover:text-caramel transition-colors"
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              Read All Reviews on Google
            </a>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="relative bg-roasted/95 text-snow py-20 sm:py-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <p className="text-xs sm:text-sm font-medium tracking-widest text-caramel">
              Visit Us Today · Open 7:00 AM – 9:00 PM
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
              Your Morning Cup on Saat Ghumti Marg Awaits
            </h2>
            <p className="mt-4 text-base sm:text-lg text-crema/80 max-w-2xl mx-auto">
              Drop in for an espresso before your trek, pick up freshly roasted Nepali Arabica
              beans, or enroll in our hands-on barista training academy.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-caramel px-6 py-3.5 text-sm sm:text-base font-semibold text-espresso hover:bg-caramel/90 transition-colors"
              >
                <span>Get Directions & Contact</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 rounded-xl border border-crema/25 px-6 py-3.5 text-sm sm:text-base font-medium text-snow hover:border-caramel hover:text-caramel transition-colors"
              >
                <span>Browse Full Menu</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
