import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80',
    tag: 'NEW ROYAL COLLECTION 2026',
    title: "Timeless Kanjivaram & Bridal Couture",
    subtitle: 'Handwoven heritage silks crafted for unforgettable celebrations.',
    cta: 'Explore Collection',
    category: 'Silk Sarees',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1600&q=80',
    tag: 'FESTIVE EXCLUSIVES',
    title: 'Opulent Designer Lehengas',
    subtitle: 'Intricate zari embroidery meets contemporary luxury silhouettes.',
    cta: 'Shop Lehengas',
    category: 'Designer Lehengas',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1600&q=80',
    tag: 'CURATED ELEGANCE',
    title: "Nandhu's Signature Evening Edit",
    subtitle: 'Statement gowns, festive kurtis, and bespoke boutique styling.',
    cta: 'View All Designs',
    category: 'All',
  },
];

export default function HeroBanner({ onSelectCategory }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % SLIDES.length);

  const handleExplore = (category) => {
    if (onSelectCategory) onSelectCategory(category);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative w-full h-[68vh] min-h-[460px] max-h-[680px] overflow-hidden bg-stone-950">
      {SLIDES.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            loading={idx === 0 ? 'eager' : 'lazy'}
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-[6000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />

          <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <div className="max-w-xl space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                {slide.tag}
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
                {slide.title}
              </h1>
              <p className="text-stone-200 text-sm sm:text-base leading-relaxed">
                {slide.subtitle}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleExplore(slide.category)}
                  className="px-6 py-3 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm tracking-wide shadow-lg shadow-amber-900/30 transition-all active:scale-95"
                >
                  {slide.cta}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/15 backdrop-blur-sm transition"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/15 backdrop-blur-sm transition"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all ${
              idx === current ? 'w-8 bg-amber-400' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}