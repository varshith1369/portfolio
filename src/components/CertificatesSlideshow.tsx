import React, { useState, useEffect, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Maximize2, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CertificateItem {
  name: string;
  issuer: string;
  date: string;
  image: string;
}

interface CertificatesSlideshowProps {
  certificates: CertificateItem[];
  onSelectCert: (cert: CertificateItem) => void;
}

export const CertificatesSlideshow: React.FC<CertificatesSlideshowProps> = ({
  certificates,
  onSelectCert,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
    dragFree: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  // Auto-play always slides left to right
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const isDragging = useRef(false);

  // Update selected index & snaps
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Navigation: scrollPrev = left-to-right (content moves right)
  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  // Auto-play: always slides right to left
  useEffect(() => {
    if (!emblaApi || isPaused) return;

    const timer = setInterval(() => {
      if (isDragging.current) return;
      scrollNext();
    }, 3500);

    return () => clearInterval(timer);
  }, [emblaApi, isPaused, scrollNext]);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slideshow Top Controls Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono tracking-wider uppercase px-3 py-1 rounded-full bg-background border border-border text-muted-foreground">
            {String(selectedIndex + 1).padStart(2, "0")} / {String(certificates.length).padStart(2, "0")}
          </span>
          <span className="text-xs text-muted-foreground hidden sm:inline-block">
            {isPaused ? "Paused on hover" : "Auto-sliding Right to Left"}
          </span>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border-border hover:bg-card hover:scale-105 active:scale-95 transition-all shadow-sm"
            title="Slide Left to Right"
            aria-label="Previous certificate"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setIsPaused((prev) => !prev)}
            className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border-border hover:bg-card hover:scale-105 active:scale-95 transition-all shadow-sm text-muted-foreground hover:text-foreground"
            title={isPaused ? "Resume auto-slideshow" : "Pause auto-slideshow"}
            aria-label={isPaused ? "Resume auto-slideshow" : "Pause auto-slideshow"}
          >
            {isPaused ? <Play className="h-4 w-4 fill-current ml-0.5" /> : <Pause className="h-4 w-4 fill-current" />}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={scrollNext}
            className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border-border hover:bg-card hover:scale-105 active:scale-95 transition-all shadow-sm"
            title="Slide Right to Left"
            aria-label="Next certificate"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Embla Viewport */}
      <div
        ref={emblaRef}
        className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onPointerDown={(e) => {
          pointerStart.current = { x: e.clientX, y: e.clientY };
          isDragging.current = false;
        }}
        onPointerMove={(e) => {
          if (pointerStart.current) {
            const dx = Math.abs(e.clientX - pointerStart.current.x);
            const dy = Math.abs(e.clientY - pointerStart.current.y);
            if (dx > 6 || dy > 6) {
              isDragging.current = true;
            }
          }
        }}
        onPointerUp={() => {
          pointerStart.current = null;
        }}
      >
        <div className="flex -ml-6 py-2">
          {certificates.map((cert, index) => {
            const isCurrent = index === selectedIndex;
            return (
              <div
                key={cert.name}
                className="min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 lg:basis-1/3 pl-6"
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (!isDragging.current) {
                      onSelectCert(cert);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectCert(cert);
                    }
                  }}
                  className={`group text-left w-full h-full rounded-3xl overflow-hidden bg-card border transition-all duration-500 flex flex-col justify-between cursor-pointer ${
                    isCurrent
                      ? "border-foreground/30 shadow-xl ring-1 ring-border"
                      : "border-border hover:border-foreground/20 hover:shadow-xl hover:-translate-y-1.5"
                  }`}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                    <img
                      src={cert.image}
                      alt={`${cert.name} certificate issued by ${cert.issuer}`}
                      loading="lazy"
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Hover Overlay with preview badge */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/90 text-foreground text-xs font-medium shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Click to view full size</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-medium leading-snug group-hover:text-primary transition-colors">
                        {cert.name}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-border/50 mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-medium truncate mr-2">{cert.issuer}</span>
                      <span className="shrink-0">{cert.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Pagination Dots & Direction helper */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-2">
          {certificates.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                selectedIndex === index
                  ? "w-8 bg-foreground"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>


      </div>
    </div>
  );
};

export default CertificatesSlideshow;
