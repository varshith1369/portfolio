import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface PortfolioCardProps {
  project: Tables<"portfolio">;
}

const PortfolioCard = ({ project }: PortfolioCardProps) => {
  const categoryLabels: Record<string, string> = {
    fashion: "Fashion",
    editorial: "Editorial",
    portrait: "Portrait",
    commercial: "Commercial",
    lifestyle: "Lifestyle",
    fine_art: "Fine Art",
  };

  // Use year from database, fallback to created_at year
  const displayYear = project.year || new Date(project.created_at).getFullYear();

  return (
    <Link 
      to={`/portfolio/${project.slug}`} 
      className="group block bg-card rounded-4xl shadow-sm transition-all duration-500 hover:-translate-y-1 overflow-hidden relative"
    >
      {/* Image Section */}
      <div className="relative h-[420px] w-full overflow-hidden rounded-t-4xl">
        <img
          src={project.preview_image_1}
          alt={project.title}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Hover Arrow Icon - Top Right Corner */}
        <div className="absolute top-[15px] right-[15px] opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300">
            <ArrowUpRight className="w-5 h-5 text-foreground" />
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-5 relative">
        {/* Title */}
        <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">
          {project.title}
        </h3>
        
        {/* Year + Category Row */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-medium">
            {displayYear}
          </span>
          <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground px-3 py-1 bg-secondary rounded-full">
            {categoryLabels[project.category] || project.category}
          </span>
        </div>
      </div>

    </Link>
  );
};

export default PortfolioCard;
