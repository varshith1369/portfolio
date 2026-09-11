import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
interface BlogCardProps {
  post: Tables<"blog">;
}
const BlogCard = ({
  post
}: BlogCardProps) => {
  return <Link to={`/blog/${post.slug}`} className="group block bg-card rounded-4xl transition-all duration-500 hover:-translate-y-1 overflow-hidden relative">
      {/* Image Section */}
      <div className="relative h-[260px] w-full overflow-hidden rounded-t-4xl">
        {post.thumbnail_url ? <img src={post.thumbnail_url} alt={post.title} className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" loading="lazy" /> : <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No image</span>
          </div>}
        
        {/* Hover Arrow Icon - Top Right Corner */}
        <div className="absolute top-[10px] right-[10px] opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300">
            <ArrowUpRight className="w-5 h-5 text-foreground" />
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg tracking-tight text-foreground mb-3 font-medium">
          {post.title}
        </h3>
        
        {/* Date + Category Row */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-normal">
            {post.read_time || 5} min read
          </span>
          <span className="text-xs tracking-wider uppercase text-muted-foreground px-3 py-1 bg-secondary rounded-full font-normal">
            Journal
          </span>
        </div>
      </div>
    </Link>;
};
export default BlogCard;