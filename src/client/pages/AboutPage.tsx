import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useReducedMotion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { fetchTestimonials } from '../lib/api';
import { MAPS_REVIEWS_URL } from '../lib/maps';
import { Reveal, SectionTitle } from '../components/Reveal';
import { MountainDivider } from '../components/MountainDivider';
import { OpenStatusBadge } from '../components/OpenStatusBadge';
import { TestimonialCarousel } from '../components/TestimonialCarousel';
import { usePageMeta } from '../hooks/usePageMeta';

gsap.registerPlugin(ScrollTrigger);

const TIMELINE_MILESTONES = [
  {
    year: '2012',
    title: 'Opening Doors in Thamel',
    location: 'Saat Ghumti Marg, Kathmandu',
    description:
      'Founded in the bustling heart of Thamel to welcome visiting trekkers and Kathmandu locals with authentic, freshly roasted 100% Nepali Arabica coffee.',
  },
  {
    year: '2015',
    title: 'Direct Himalayan Farm Partnerships',
    location: 'Ilam · Gorkha · Nuwakot',
    description:
      'Strengthened direct sourcing with smallholder hillside growers above 1,400 meters, championing organic shade-grown Himalayan Arabica harvests.',
  },
  {
    year: '2018',
    title: 'Over 100 Coffee Flavors & Bakery',
    location: 'Thamel Espresso Bar',
    description:
      'Expanded our menu beyond classic espresso to 100+ signature coffee creations alongside daily fresh-baked croissants, brownies, and cheesecakes.',
  },
  {
    year: '2021',
    title: 'Barista Training Academy',
    location: 'Kathmandu Coffee Craft',
    description:
      'Launched our intensive 15-day professional barista certification program, equipping aspiring Nepali and international baristas with espresso and latte art mastery.',
  },
  {
    year: 'Today',
    title: 'A Landmark for Mountain Coffee',
    location: 'Serving Daily 7 AM – 9 PM',
    description:
      'Continuing our mission as one of the finest coffee houses in Nepal—pairing warm Himalayan hospitality with roasted beans and coffee gear for home.',
  },
];

export function AboutPage() {
  const prefersReducedMotion = useReducedMotion();
  usePageMeta(
    'Our Story & Timeline – Himalayan Arabica Beans, Thamel',
    'From a 2012 Thamel espresso bar to a Himalayan Arabica landmark: our farm partnerships, 100+ coffee flavors and 15-day barista academy in Kathmandu.'
  );
  const pinSectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const { data: testimonialsData } = useQuery({
    queryKey: ['testimonials'],
    queryFn: fetchTestimonials,
  });
  const testimonials = testimonialsData?.testimonials ?? [];

  useEffect(() => {
    if (prefersReducedMotion || !pinSectionRef.current || !trackRef.current) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const track = trackRef.current;
      const container = pinSectionRef.current;
      if (!track || !container) return;

      const getScrollAmount = () => Math.max(0, track.scrollWidth - container.clientWidth + 64);

      gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top 12%',
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => mm.revert();
  }, [prefersReducedMotion]);

  return (
    <div className="pt-28 bg-crema dark:bg-espresso text-espresso dark:text-snow">
      {/* Intro Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <SectionTitle
              kicker="Our Heritage · Est. 2012"
              title="100% Pure Arabica From the Himalayan Foothills"
              subtitle="Himalayan Arabica Beans is one of the finest coffee houses in Nepal, rooted in Thamel’s vibrant traveler community since 2012."
            />
            <Reveal delay={0.12}>
              <div className="mt-4">
                <OpenStatusBadge showDetail />
              </div>
              <p className="mt-6 text-sm sm:text-base leading-relaxed text-roasted/85 dark:text-crema/80">
                Opened to serve fresh Himalayan coffee to visiting tourists and Kathmandu residents
                alike, our coffee house sources organic Arabica beans grown in Nepal’s high-altitude
                valleys. From single-origin espresso shots to 100+ coffee flavor expressions, crisp
                pastries, packaged take-home beans, and 15-day barista training, every detail honors
                Nepali coffee craft.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.18} className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-lg">
                <img
                  src="/src/assets/images/gallery_barista_pour_1794813062040.jpg"
                  alt="Barista pouring steamed milk in Thamel coffee house"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[3/4] mt-8 shadow-lg">
                <img
                  src="/src/assets/images/about_thamel_roastery_1794813060860.jpg"
                  alt="Himalayan Arabica Beans interior and coffee sacks"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <MountainDivider
        topColorClass="bg-crema dark:bg-espresso"
        fillClass="text-[#EFE0CC] dark:text-roasted"
      />

      {/* Horizontal Scroll Timeline (Desktop Pin + Mobile Vertical Stack) */}
      <section className="bg-[#EFE0CC] dark:bg-roasted text-espresso dark:text-snow py-20 overflow-hidden">
        <div ref={pinSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <SectionTitle
              kicker="2012 — Today"
              title="Our Journey Across the Years"
              subtitle="Scroll to trace how a cozy Thamel espresso bar grew into a beloved hub for Nepali Arabica coffee and barista education."
            />
          </div>

          <div
            ref={trackRef}
            className="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:w-max"
          >
            {TIMELINE_MILESTONES.map((step, idx) => (
              <article
                key={step.year}
                className="lg:w-[400px] shrink-0 rounded-2xl bg-crema/90 dark:bg-espresso/85 border border-mocha/15 dark:border-crema/12 p-7 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-mocha/15 dark:border-crema/10 pb-4">
                    <span className="font-serif text-4xl font-semibold text-caramel tabular-nums">
                      {step.year}
                    </span>
                    <span className="text-xs font-medium text-mocha dark:text-crema/70">
                      0{idx + 1}. {step.location}
                    </span>
                  </div>
                  <h3 className="mt-5 font-serif text-2xl font-semibold text-espresso dark:text-snow">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-roasted/85 dark:text-crema/80">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
          <div className="mb-10">
            <SectionTitle
              align="center"
              kicker="Guest Voices · Since 2012"
              title="Testimonials From Our Journey Across the Years"
              subtitle="Trekkers, travelers, students and Kathmandu locals share how a cup at our Thamel coffee house became part of their story."
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

      {/* Barista Academy & Roastery Pillar */}
      <section className="bg-crema dark:bg-espresso py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-roasted text-snow p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <p className="text-xs sm:text-sm font-medium tracking-widest text-caramel">
                15-Day Professional Barista Training
              </p>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-semibold">
                Learn the Craft Behind Every Himalayan Cup
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-crema/80 max-w-2xl">
                Our Thamel academy trains aspiring baristas in espresso extraction, grind
                calibration, silky microfoam pouring, manual brew methods, and café hospitality.
              </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-caramel px-6 py-3.5 text-sm font-semibold text-espresso hover:bg-caramel/90 transition-colors"
              >
                <span>Inquire About Training</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
