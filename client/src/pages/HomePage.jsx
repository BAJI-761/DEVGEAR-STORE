import { Link } from 'react-router-dom';
import { ArrowRight, Star, Zap, Monitor } from 'lucide-react';

export default function HomePage() {
  return (
    <section className="relative" aria-labelledby="home-hero-title">
      {/* ── HERO CARD ── */}
      <div className="neo-card relative overflow-hidden min-h-[75vh] md:min-h-[80vh] flex items-center">
        {/* Background texture */}
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" aria-hidden="true" />

        {/* Floating decorative elements */}
        <div
          className="absolute top-6 right-6 md:top-10 md:right-10 w-16 h-16 md:w-24 md:h-24 border-4 border-ink bg-secondary rotate-12 shadow-neo-sm hidden sm:block"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-12 right-16 md:bottom-20 md:right-32 w-12 h-12 md:w-16 md:h-16 border-4 border-ink bg-muted -rotate-6 shadow-neo-sm hidden sm:block"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/4 right-8 md:right-16"
          aria-hidden="true"
        >
          <Star className="w-10 h-10 md:w-14 md:h-14 text-accent fill-accent animate-spin-slow" strokeWidth={0} />
        </div>
        <div
          className="absolute bottom-8 left-6 md:bottom-12 md:left-12"
          aria-hidden="true"
        >
          <Star className="w-8 h-8 md:w-10 md:h-10 text-secondary fill-secondary animate-spin-slow" strokeWidth={0} style={{ animationDirection: 'reverse', animationDuration: '15s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl px-2 md:px-4">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary border-4 border-ink shadow-neo-sm rotate-1 mb-6 md:mb-8">
            <Zap className="w-4 h-4" strokeWidth={3} />
            <span className="font-black text-xs uppercase tracking-widest">Neo-brutalist developer marketplace</span>
          </div>

          {/* Headline */}
          <h1
            id="home-hero-title"
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black uppercase leading-[0.85] tracking-tighter max-w-[14ch] mb-6"
          >
            Gear up your{' '}
            <span className="text-stroke-lg inline-block -rotate-1">workflow</span>{' '}
            with loud, useful hardware.
          </h1>

          {/* Lead */}
          <p className="text-lg md:text-xl font-bold max-w-[50ch] leading-relaxed mb-8">
            DevGear Store is the starting point for developer-focused commerce: fast catalog browsing, cart flows, and a
            production-ready backend foundation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/products"
              className="neo-btn neo-btn-primary text-base !shadow-neo"
              aria-label="Browse products"
            >
              <Monitor className="w-5 h-5" strokeWidth={3} />
              Browse products
              <ArrowRight className="w-5 h-5" strokeWidth={3} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── MARQUEE DIVIDER ── */}
      <div className="border-y-4 border-ink bg-ink text-surface py-3 overflow-hidden mt-8">
        <div className="flex whitespace-nowrap animate-marquee gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="flex items-center gap-3 font-black text-sm uppercase tracking-widest">
              <Star className="w-4 h-4 fill-secondary text-secondary" strokeWidth={0} />
              Keyboards · Monitors · Audio · Laptops · Accessories
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}