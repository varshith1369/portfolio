import Layout from "@/components/layout/Layout";
import { usePortfolioList } from "@/hooks/usePortfolio";
import PortfolioCard from "@/components/portfolio/PortfolioCard";
import LoadingSkeleton from "@/components/ui/loading-skeleton";
import { HeroContent, HeroItem, StaggerContainer, StaggerItem } from "@/components/ui/scroll-animation";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection";

const Portfolio = () => {
  const { data: portfolio, isLoading, error } = usePortfolioList();

  return (
    <Layout>
      {/* Page Header */}
      <section className="py-20 md:py-28">
        <div className="container">
          <HeroContent className="max-w-2xl">
            <HeroItem>
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">
                Our Work
              </p>
            </HeroItem>
            <HeroItem>
              <h1 className="text-4xl md:text-6xl tracking-tight font-normal">
                Explore Our Success Stories
              </h1>
            </HeroItem>
            <HeroItem>
              <p className="mt-6 text-lg text-muted-foreground">
                Crafting brand experiences that captivate and connect with audiences.
              </p>
            </HeroItem>
          </HeroContent>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="pb-24 md:pb-32">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[...Array(4)].map((_, i) => <LoadingSkeleton key={i} variant="card" />)}
            </div>
          ) : error ? (
            <div className="text-center py-20 text-destructive">
              <p>Error loading portfolio. Please try again later.</p>
            </div>
          ) : portfolio && portfolio.length > 0 ? (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {portfolio.map(project => (
                <StaggerItem key={project.id}>
                  <PortfolioCard project={project} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-semibold mb-4">No Projects Yet</h2>
                <p className="text-muted-foreground">
                  Portfolio items will appear here once added through Lovable Cloud.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />
    </Layout>
  );
};

export default Portfolio;
