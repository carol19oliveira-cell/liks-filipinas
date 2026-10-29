/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface TestimonialSlide {
  id: string;
  image: string;
  fallback: string;
  alt: string;
}

const testimonialsData: TestimonialSlide[] = [
  {
    id: "bill-bass",
    image: "/testimonials/testimonial_3.png",
    fallback: "https://i.ibb.co/gbsyvhWt/Chat-GPT-Image-27-de-ago-de-2026-16-49-09.png",
    alt: "Bill Bass Testimonial"
  },
  {
    id: "mike-bassist",
    image: "/testimonials/testimonial_1.png",
    fallback: "https://i.ibb.co/5ggXb7cL/Chat-GPT-Image-27-de-ago-de-2026-16-46-02.png",
    alt: "Mike Bassist Testimonial"
  },
  {
    id: "jake-b",
    image: "/testimonials/testimonial_6.png",
    fallback: "https://i.ibb.co/jkqH9CfV/DEPOIMENTOS-EM-INGLES.png",
    alt: "Jake B. Testimonial"
  },
  {
    id: "junio-marcello",
    image: "/testimonials/testimonial_4.png",
    fallback: "https://i.ibb.co/NdFP70CX/Chat-GPT-Image-27-de-ago-de-2026-17-38-13.png",
    alt: "junio.marcello Testimonial"
  },
  {
    id: "brandon",
    image: "/testimonials/testimonial_2.png",
    fallback: "https://i.ibb.co/J9zgKr9/Chat-GPT-Image-27-de-ago-de-2026-16-47-37.png",
    alt: "Brandon Testimonial"
  }
];

interface TestimonialsCarouselProps {
  onCtaClick?: () => void;
}

export default function TestimonialsCarousel({ onCtaClick }: TestimonialsCarouselProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const resumeTimeoutRef = useRef<number | null>(null);

  // Triple set for seamless infinite looping
  const displayItems = [...testimonialsData, ...testimonialsData, ...testimonialsData];

  // Guarantee container starts at 0 (Bill Bass) and only starts scrolling after user arrives at the section
  useEffect(() => {
    const el = sectionRef.current;
    const container = scrollRef.current;
    
    // Explicitly reset scroll to position 0 so Bill Bass is front and center
    if (container) {
      container.scrollLeft = 0;
    }

    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Ensure container is at 0 when user reaches the section
            if (scrollRef.current && !hasEnteredView) {
              scrollRef.current.scrollLeft = 0;
            }
            // Give the user a brief moment to see Bill Bass clearly first before the slow scroll kicks off
            setTimeout(() => {
              setHasEnteredView(true);
            }, 1200);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasEnteredView]);

  // Continuous slow scrolling motion (starts only after user reaches the section)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !hasEnteredView) return;

    let animationFrameId: number;
    let lastTimestamp = performance.now();
    let scrollPos = container.scrollLeft;

    // Slow, readable speed: ~45 pixels per second
    const scrollSpeed = 45;

    const step = (timestamp: number) => {
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (!isPaused && !isInteracting && container) {
        scrollPos += scrollSpeed * delta;
        const singleSetWidth = container.scrollWidth / 3;

        // When reached the end of one set, loop seamlessly
        if (scrollPos >= singleSetWidth * 2) {
          scrollPos -= singleSetWidth;
        } else if (scrollPos <= 0) {
          scrollPos += singleSetWidth;
        }

        container.scrollLeft = scrollPos;
      } else if (container) {
        scrollPos = container.scrollLeft;
      }

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, isInteracting, hasEnteredView]);

  const pauseTemporarily = (duration = 3000) => {
    setIsInteracting(true);
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = window.setTimeout(() => {
      setIsInteracting(false);
    }, duration);
  };

  const handleScrollLeft = () => {
    pauseTemporarily(3500);
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -380, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    pauseTemporarily(3500);
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 380, behavior: "smooth" });
    }
  };

  const handleScrollToOffer = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      const cta = document.getElementById("cta-section");
      if (cta) {
        cta.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="testimonials-section" 
      className="relative w-full py-16 md:py-24 overflow-hidden border-t border-b border-white/[0.06] bg-gradient-to-b from-[#060913] via-[#0b0f24] to-[#060913]"
    >
      {/* Subtle dotted matrix / texture effect & ambient glows */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }} 
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] ambient-glow-orange pointer-events-none opacity-20 blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-10">
        
        {/* ================= SECTION HEADER ================= */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black italic tracking-tight text-white uppercase leading-none drop-shadow-sm">
            BASS PLAYERS WHO JOINED, RECOMMEND IT.
          </h2>
          <p className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-brand-amber font-display">
            SEE WHAT BASS PLAYERS ARE SAYING
          </p>
        </div>

        {/* ================= CONTINUOUS SLOW-SCROLLING CAROUSEL ================= */}
        <div 
          className="relative w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => pauseTemporarily(4000)}
        >
          {/* Edge fade gradients for smooth entrance/exit */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#060913] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#060913] to-transparent z-10 pointer-events-none" />

          {/* Floating Left Navigation Arrow */}
          <button
            onClick={handleScrollLeft}
            aria-label="Scroll left"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/85 hover:bg-black text-white border border-white/20 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Floating Right Navigation Arrow */}
          <button
            onClick={handleScrollRight}
            aria-label="Scroll right"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/85 hover:bg-black text-white border border-white/20 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* The Continuously Scrolling Track */}
          <div
            ref={scrollRef}
            className="w-full overflow-x-auto flex items-center gap-6 sm:gap-8 py-4 px-8 select-none scrollbar-none cursor-grab active:cursor-grabbing"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch"
            }}
          >
            {displayItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex-shrink-0 flex items-center justify-center transition-transform duration-300 hover:scale-[1.02]"
              >
                {/* Pure screenshot image: NO card border, NO outer box, NO fake headers */}
                <img
                  src={item.image}
                  alt={item.alt}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = item.fallback;
                  }}
                  className="w-auto h-[260px] sm:h-[300px] md:h-[340px] max-w-[85vw] sm:max-w-md md:max-w-lg object-contain rounded-xl select-none pointer-events-none drop-shadow-[0_15px_35px_rgba(0,0,0,0.7)]"
                  loading="eager"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* ================= CONTROLS ROW ================= */}
          {/* < PREVIOUS | SWIPE OR USE THE ARROWS | NEXT > */}
          <div className="mt-6 flex items-center justify-between gap-4 px-4 max-w-xl mx-auto">
            
            {/* Previous Button */}
            <button
              onClick={handleScrollLeft}
              className="px-4 py-2 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/10 active:bg-white/15 text-slate-300 hover:text-white font-mono text-xs font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              PREVIOUS
            </button>

            {/* Central Guide */}
            <span className="text-[11px] font-mono text-slate-400 tracking-wider uppercase font-semibold text-center">
              SWIPE OR USE THE ARROWS
            </span>

            {/* Next Button */}
            <button
              onClick={handleScrollRight}
              className="px-4 py-2 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/10 active:bg-white/15 text-slate-300 hover:text-white font-mono text-xs font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              NEXT
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ================= BOTTOM CTA TRANSITION ================= */}
        <div className="pt-8 text-center space-y-4 max-w-md mx-auto">
          {/* Subtle line with orange bead */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-brand-orange/40" />
            <div className="w-2 h-2 rounded-full bg-brand-orange shadow-sm shadow-brand-orange/50" />
            <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-brand-orange/40" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-display font-black italic tracking-tight text-white uppercase">
              NOW IT’S YOUR TURN
            </h3>
            
            <button
              onClick={handleScrollToOffer}
              className="inline-flex items-center justify-center gap-1.5 text-sm sm:text-base font-mono font-bold tracking-wider text-brand-orange hover:text-brand-amber transition-colors uppercase cursor-pointer group"
            >
              <span>GET THE SPECIAL OFFER ↓</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
