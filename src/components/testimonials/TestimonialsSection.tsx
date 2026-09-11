import { Star } from "lucide-react";
import { useTestimonials } from "@/hooks/useTestimonials";
import { SectionHeader, StaggerContainer, StaggerItem } from "@/components/ui/scroll-animation";

const TestimonialsSection = () => {
  const { data: testimonials, isLoading } = useTestimonials();

  return (
    <section className="py-24 md:py-32">
      <div className="container">
        {/* Section Header */}
        <SectionHeader className="text-center mb-16">
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4">
            What Our Clients Say
          </p>
          <h2 className="text-4xl tracking-tight mb-6 font-normal md:text-4xl">
            What Our Clients Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by brands for seamless collaboration and superior design.
          </p>
        </SectionHeader>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-card rounded-4xl p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-4 h-4 bg-muted rounded" />
                  ))}
                </div>
                <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-2/3 mb-4" />
                <div className="flex items-center gap-3">
                  <div className="w-[45px] h-[45px] bg-muted rounded-full" />
                  <div>
                    <div className="h-4 bg-muted rounded w-20 mb-1" />
                    <div className="h-3 bg-muted rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : testimonials && testimonials.length > 0 ? (
          /* Testimonials Grid */
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <StaggerItem key={testimonial.id}>
                <div className="group bg-card rounded-4xl overflow-hidden hover:scale-[1.02] transition-transform duration-500 p-6">
                  {/* Star Rating */}
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-black text-black" />
                    ))}
                  </div>
                  <h3 className="text-lg mb-3 font-normal">
                    "{testimonial.name}"
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {testimonial.testimonial_text}
                  </p>
                  <div className="flex items-center gap-3">
                    {testimonial.avatar_url ? (
                      <img
                        src={testimonial.avatar_url}
                        alt={testimonial.name}
                        className="w-[45px] h-[45px] rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          (e.currentTarget.nextElementSibling as HTMLElement)?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-[45px] h-[45px] rounded-full bg-muted flex items-center justify-center ${testimonial.avatar_url ? 'hidden' : ''}`}>
                      <span className="text-lg font-medium text-muted-foreground">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium block">{testimonial.name}</span>
                      <span className="text-sm text-muted-foreground">
                        @{testimonial.role_or_company}
                      </span>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          /* Empty State */
          <div className="text-center py-20 text-muted-foreground">
            <p>No testimonials yet. Add some in Lovable Cloud.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
