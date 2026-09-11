import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// ============================================
// 🖼️ SLIDER IMAGES - EASY TO CHANGE
// Just replace the imports below with your images
// ============================================
import slider1 from "@/assets/slider-1.png";
import slider2 from "@/assets/slider-2.png";
import slider3 from "@/assets/slider-3.jpg";
import slider4 from "@/assets/slider-4.jpg";

// ============================================
// 📝 SLIDE CONTENT - Edit titles, subtitles, descriptions here
// ============================================
const SLIDES = [{
  image: slider1,
  title: "Discover & Align",
  subtitle: "Week One",
  description: "We listen, research, and deeply understand your vision to establish a strong foundation."
}, {
  image: slider2,
  title: "Design & Iterate",
  subtitle: "Week Two",
  description: "We explore concepts, create prototypes, and refine ideas through thoughtful iteration."
}, {
  image: slider3,
  title: "Develop & Launch",
  subtitle: "Week Three",
  description: "We finalize the product and prepare for a smooth launch that exceeds expectations."
}, {
  image: slider4,
  title: "Creative Excellence",
  subtitle: "Always",
  description: "Delivering premium visual experiences that elevate your brand identity."
}];
const ProcessSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0);
  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide(prev => (prev + 1) % SLIDES.length);
  }, []);
  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide(prev => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);
  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  // Auto-play with 5s delay
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: {
          type: "tween" as const,
          duration: 0.7,
          ease: [0.32, 0.72, 0, 1] as [number, number, number, number]
        },
        opacity: {
          duration: 0.5
        }
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1,
      transition: {
        x: {
          type: "tween" as const,
          duration: 0.7,
          ease: [0.32, 0.72, 0, 1] as [number, number, number, number]
        },
        opacity: {
          duration: 0.3
        }
      }
    })
  };
  const imageVariants = {
    enter: {
      scale: 1.1
    },
    center: {
      scale: 1.05,
      transition: {
        duration: 5,
        ease: "linear" as const
      }
    }
  };
  const textVariants = {
    hidden: {
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.3,
        ease: [0.32, 0.72, 0, 1] as [number, number, number, number]
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };
  return <section className="py-16 md:py-24">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Our Process
          </p>
          <h2 className="text-4xl md:text-5xl tracking-tight mb-6 font-normal lg:text-4xl">
            Our Process, Simplified
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Strategic creativity for outstanding brand identities.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="inline-flex items-center gap-2 bg-foreground text-background font-medium rounded-full hover:bg-foreground/90 transition-all duration-300 hover:gap-3 py-[11px] px-[20px]">
              Get In Touch
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/portfolio" className="inline-flex items-center gap-2 px-8 py-3.5 border border-foreground/20 text-foreground font-medium rounded-full hover:bg-foreground/5 transition-all duration-300">
              Explore Work
            </Link>
          </div>
        </div>

        {/* Slider Container */}
        <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          {/* Aspect Ratio Container */}
          <div className="relative aspect-video">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div key={currentSlide} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" className="absolute inset-0">
                {/* Image with parallax */}
                <motion.div variants={imageVariants} initial="enter" animate="center" className="absolute inset-0">
                  <img src={SLIDES[currentSlide].image} alt={SLIDES[currentSlide].title} className="w-full h-full object-cover" loading="lazy" />
                </motion.div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

                {/* Text Overlay */}
                <motion.div variants={textVariants} initial="hidden" animate="visible" exit="exit" className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-14">
                  <span className="inline-block text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-white/70 mb-2 md:mb-3">
                    {SLIDES[currentSlide].subtitle}
                  </span>
                  <h3 className="text-2xl md:text-4xl lg:text-5xl text-white mb-2 md:mb-4 tracking-tight font-normal">
                    {SLIDES[currentSlide].title}
                  </h3>
                  <p className="text-sm md:text-base lg:text-lg text-white/80 max-w-lg leading-relaxed">
                    {SLIDES[currentSlide].description}
                  </p>
                  
                  {/* CTA Button */}
                  <Link to="/contact" className="inline-flex items-center gap-2 mt-4 md:mt-6 px-5 md:px-6 py-2.5 md:py-3 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 hover:gap-3">
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button onClick={prevSlide} className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110" aria-label="Previous slide">
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button onClick={nextSlide} className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110" aria-label="Next slide">
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3">
              {SLIDES.map((_, index) => <button key={index} onClick={() => goToSlide(index)} className="group relative p-1" aria-label={`Go to slide ${index + 1}`}>
                  <motion.div className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-colors duration-300 ${index === currentSlide ? "bg-white" : "bg-white/40 group-hover:bg-white/60"}`} animate={{
                scale: index === currentSlide ? 1.4 : 1,
                opacity: index === currentSlide ? 1 : 0.6
              }} transition={{
                duration: 0.3
              }} />
                </button>)}
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ProcessSlider;