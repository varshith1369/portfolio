import Layout from "@/components/layout/Layout";
import { useBlogList } from "@/hooks/useBlog";
import BlogCard from "@/components/blog/BlogCard";
import LoadingSkeleton from "@/components/ui/loading-skeleton";
import { HeroContent, HeroItem, StaggerContainer, StaggerItem } from "@/components/ui/scroll-animation";

const Blog = () => {
  const { data: posts, isLoading, error } = useBlogList();

  return (
    <Layout>
      {/* Page Header */}
      <section className="py-20 md:py-28">
        <div className="container">
          <HeroContent className="max-w-2xl">
            <HeroItem>
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">
                Insights & Stories
              </p>
            </HeroItem>
            <HeroItem>
              <h1 className="text-4xl md:text-6xl tracking-tight font-normal">
                Our Inshights
              </h1>
            </HeroItem>
            <HeroItem>
              <p className="mt-6 text-lg text-muted-foreground">
                We keep it simple: valuable ideas, seamless flow, and design-driven storytelling to inspire your readers.
              </p>
            </HeroItem>
          </HeroContent>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="pb-24 md:pb-32">
        <div className="container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-wide bg-muted rounded-2xl" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-muted rounded w-1/4" />
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 text-destructive">
              <p>Error loading blog posts. Please try again later.</p>
            </div>
          ) : posts && posts.length > 0 ? (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => (
                <StaggerItem key={post.id}>
                  <BlogCard post={post} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-semibold mb-4">No Posts Yet</h2>
                <p className="text-muted-foreground">
                  Blog posts will appear here once added through Lovable Cloud.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
