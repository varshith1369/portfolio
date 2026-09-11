import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, CheckCircle2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { projects } from "@/data/projects";
import { FadeUp, HeroContent, HeroItem, StaggerContainer, StaggerItem } from "@/components/ui/scroll-animation";
import SkillChip from "@/components/SkillChip";

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  if (!project) return <Navigate to="/" replace />;

  const idx = projects.findIndex((p) => p.slug === slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <Layout hasHero={false}>
      {/* Header */}
      <section className="pt-28 md:pt-36 pb-14">
        <div className="container">
          <HeroContent className="max-w-4xl">
            <HeroItem>
              <Link
                to="/#projects"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" /> Back to projects
              </Link>
            </HeroItem>
            <HeroItem>
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3">
                Project {String(idx + 1).padStart(2, "0")} · {project.subtitle}
              </p>
              <h1 className="text-4xl md:text-6xl tracking-tight font-normal">{project.title}</h1>
            </HeroItem>
            <HeroItem>
              <p className="inline-flex items-center gap-2 text-sm text-muted-foreground mt-4">
                <Calendar className="w-4 h-4" /> {project.period}
              </p>
            </HeroItem>
            <HeroItem>
              <p className="text-lg text-muted-foreground leading-relaxed mt-6 max-w-3xl">
                {project.overview}
              </p>
            </HeroItem>
          </HeroContent>
        </div>
      </section>

      {/* Screenshot */}
      <section className="pb-20">
        <div className="container max-w-5xl">
          <FadeUp>
            <div className="rounded-4xl overflow-hidden border border-border shadow-2xl bg-muted">
              <img
                src={project.image}
                alt={project.imageAlt}
                loading="lazy"
                className="w-full h-auto"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Tech stack */}
      <section className="pb-20">
        <div className="container max-w-4xl">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl tracking-tight font-normal mb-6">Tech stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <SkillChip key={tech} name={tech} />
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* What I built */}
      <section className="pb-20">
        <div className="container max-w-4xl">
          <FadeUp>
            <h2 className="text-2xl md:text-3xl tracking-tight font-normal mb-10">What I built</h2>
          </FadeUp>
          <StaggerContainer className="space-y-6">
            {project.built.map((item) => (
              <StaggerItem key={item.heading}>
                <div className="p-7 rounded-3xl bg-card border border-border">
                  <h3 className="text-lg font-medium mb-2">{item.heading}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.detail}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Highlights */}
      <section className="pb-24">
        <div className="container max-w-4xl">
          <FadeUp>
            <div className="p-8 md:p-10 rounded-4xl bg-black text-white">
              <h2 className="text-2xl md:text-3xl tracking-tight font-normal mb-8">Key highlights</h2>
              <ul className="space-y-4">
                {project.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-white/80 leading-relaxed">
                    <CheckCircle2 className="w-5 h-5 text-white/60 shrink-0 mt-0.5" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Next project */}
      <section className="pb-24">
        <div className="container max-w-4xl">
          <FadeUp>
            <Link
              to={`/projects/${next.slug}`}
              className="group flex items-center justify-between gap-4 p-7 rounded-3xl bg-card border border-border hover:shadow-xl transition-all duration-500"
            >
              <div>
                <p className="text-sm text-muted-foreground mb-1">Next project</p>
                <p className="text-xl font-medium">{next.title}</p>
              </div>
              <ArrowRight className="w-6 h-6 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </FadeUp>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectDetail;
