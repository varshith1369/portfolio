import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DOMPurify from "dompurify";
import Layout from "@/components/layout/Layout";
import { usePortfolioItem } from "@/hooks/usePortfolio";
import LoadingSkeleton from "@/components/ui/loading-skeleton";
import { HeroContent, HeroItem, FadeScale, StaggerContainer, StaggerItem } from "@/components/ui/scroll-animation";

const PortfolioDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, error } = usePortfolioItem(slug || "");

  const categoryLabels: Record<string, string> = {
    fashion: "Fashion",
    editorial: "Editorial",
    portrait: "Portrait",
    commercial: "Commercial",
    lifestyle: "Lifestyle",
    fine_art: "Fine Art"
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-32" />
            <div className="h-12 bg-muted rounded w-2/3" />
            <div className="grid grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => <LoadingSkeleton key={i} variant="image" />)}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <div className="container py-20">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/portfolio" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full">
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const images = [project.preview_image_1, project.preview_image_2, project.preview_image_3, project.preview_image_4].filter(Boolean) as string[];

  return (
    <Layout>
      {/* Header */}
      <section className="py-16 md:py-24">
        <div className="container">
          <HeroContent>
            <HeroItem>
              <Link to="/portfolio" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
                <ArrowLeft className="w-4 h-4" />
                Back to Portfolio
              </Link>
            </HeroItem>

            <div className="max-w-3xl">
              <HeroItem>
                <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-wider uppercase bg-secondary rounded-full mb-6">
                  {categoryLabels[project.category] || project.category}
                </span>
              </HeroItem>
              <HeroItem>
                <h1 className="text-4xl md:text-6xl tracking-tight font-normal">
                  {project.title}
                </h1>
              </HeroItem>
              {project.description && (
                <HeroItem>
                  <div 
                    className="mt-8 prose-editorial" 
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(project.description) }} 
                  />
                </HeroItem>
              )}
            </div>
          </HeroContent>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="pb-24 md:pb-32">
        <div className="container">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {images.map((image, index) => (
              <StaggerItem key={index}>
                <FadeScale>
                  <div className="overflow-hidden rounded-xl h-[400px]">
                    <img 
                      src={image} 
                      alt={`${project.title} - Image ${index + 1}`} 
                      className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105" 
                      loading={index === 0 ? "eager" : "lazy"} 
                    />
                  </div>
                </FadeScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </Layout>
  );
};

export default PortfolioDetail;
