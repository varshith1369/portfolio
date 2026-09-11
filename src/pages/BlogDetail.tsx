import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import Layout from "@/components/layout/Layout";
import { useBlogPost } from "@/hooks/useBlog";
import { HeroContent, HeroItem, FadeUp, FadeScale } from "@/components/ui/scroll-animation";

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug || "");

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-20 max-w-3xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-32" />
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-12 bg-muted rounded w-full" />
            <div className="aspect-wide bg-muted rounded-2xl" />
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="container py-20">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/blog" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full">
              <ArrowLeft className="w-4 h-4" />
              Back to Journal
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="py-16 md:py-24">
        <div className="container max-w-3xl mx-auto">
          <HeroContent>
            <HeroItem>
              <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
                <ArrowLeft className="w-4 h-4" />
                Back to Journal
              </Link>
            </HeroItem>

            <header className="mb-12">
              <HeroItem>
                <time className="text-sm font-medium tracking-wider uppercase text-muted-foreground">
                  {format(new Date(post.publish_date), "MMMM d, yyyy")}
                </time>
              </HeroItem>
              <HeroItem>
                <h1 className="mt-4 text-4xl md:text-5xl tracking-tight text-balance font-normal">
                  {post.title}
                </h1>
              </HeroItem>
              {post.excerpt && (
                <HeroItem>
                  <p className="mt-6 text-xl text-muted-foreground">
                    {post.excerpt}
                  </p>
                </HeroItem>
              )}
            </header>
          </HeroContent>

          {post.thumbnail_url && (
            <FadeScale className="mb-12">
              <div className="overflow-hidden rounded-2xl">
                <img src={post.thumbnail_url} alt={post.title} className="w-full h-[400px] object-cover object-center" />
              </div>
            </FadeScale>
          )}

          {post.content && (
            <FadeUp delay={0.2}>
              <div 
                className="prose-editorial" 
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} 
              />
            </FadeUp>
          )}
        </div>
      </article>
    </Layout>
  );
};

export default BlogDetail;
