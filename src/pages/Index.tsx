import { Link } from "react-router-dom";
import { ArrowRight, Mail, Phone, Github, Linkedin, Award, Trophy, GraduationCap, BookOpen, Code2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FadeUp, HeroContent, HeroItem, SectionHeader, StaggerContainer, StaggerItem } from "@/components/ui/scroll-animation";
import SkillChip from "@/components/SkillChip";
import heroBg from "@/assets/hero-bg.jpg";
import deloitteCert from "@/assets/certs/cert-deloitte.png";
import oracleAiCert from "@/assets/certs/cert-oracle-ai.png";
import oracleDataCert from "@/assets/certs/cert-oracle-data.png";
import powerbiCert from "@/assets/certs/cert-powerbi.png";
import infosysCert from "@/assets/certs/cert-infosys-dsa.png";
import ncatCert from "@/assets/certs/cert-ncat.png";
import lpuMeritCert from "@/assets/certs/cert-lpu-dsa-merit.png";
import CertificatesSlideshow from "@/components/CertificatesSlideshow";
import { getAdminData, subscribeToPortfolioData, type AdminData } from "@/lib/adminStore";

const achievementStyles = [
  { color: "from-amber-500/15 to-yellow-500/10", border: "border-amber-500/20", glow: "rgba(245,158,11,0.15)" },
  { color: "from-indigo-500/15 to-violet-500/10", border: "border-indigo-500/20", glow: "rgba(99,102,241,0.15)" },
  { color: "from-emerald-500/15 to-teal-500/10", border: "border-emerald-500/20", glow: "rgba(16,185,129,0.15)" },
  { color: "from-rose-500/15 to-pink-500/10", border: "border-rose-500/20", glow: "rgba(244,63,94,0.15)" },
];

const skillGroups = [
  { title: "Programming Languages", items: ["Python", "SQL", "C++", "Java"] },
  { title: "Data Science", items: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Data Cleaning", "EDA", "Feature Engineering"] },
  { title: "Machine Learning", items: ["scikit-learn", "Classification", "Regression", "Data Preprocessing"] },
  { title: "Visualization & Analysis", items: ["Power BI", "Tableau", "Excel"] },
  { title: "Web", items: ["HTML", "CSS", "JavaScript", "REST APIs"] },
  { title: "Databases", items: ["MongoDB", "Firebase", "Supabase", "MySQL"] },
  { title: "Tools & Platforms", items: ["Git", "GitHub", "Jupyter Notebook", "Google Colab", "VS Code", "Microsoft Copilot Studio"] },
  { title: "CS Fundamentals", items: ["DSA", "OS", "DBMS", "CN"] },
  { title: "Soft Skills", items: ["Analytical Thinking", "Communication", "Leadership", "Problem Solving"] },
];

const projects = [
  {
    slug: "talentforge",
    title: "TalentForge",
    subtitle: "AI-Assisted Placement Preparation Desktop App (Java)",
    period: "Jun 2026 – Jul 2026",
    points: [
      "Designed the UI/UX and Java Swing architecture for a multi-module placement-prep desktop app, including login/signup with animations and a FlatLaf-themed dashboard.",
      "Built a 14-table SQLite database layer to persist user accounts, stats, and skill-tracking data across sessions.",
      "Deployed a Trie-based Resume Checker that parses PDF resumes (Apache PDFBox) and scores them against a keyword bank.",
      "Implemented the Analytics dashboard with bar/donut/sparkline charts to visualize user progress and ranking.",
    ],
    stack: ["Java", "Swing", "SQLite", "Apache PDFBox", "FlatLaf"],
  },
  {
    slug: "bitenow",
    title: "BiteNow",
    subtitle: "Full-Stack Food Delivery Website",
    period: "May 2026 – Jun 2026",
    points: [
      "Built a full-stack food delivery platform (Customer, Rider, Admin) with real-time tracking, chat, and push notifications.",
      "Engineered with TanStack Start (React 19 + Vite 7), Tailwind CSS v4, and Supabase (Postgres + Auth + Realtime).",
      "Designed role-based access control and order-state management to ensure secure, synchronized workflows across Customer, Rider, and Admin dashboards.",
    ],
    stack: ["React 19", "Vite 7", "Tailwind CSS v4", "Supabase", "Realtime"],
  },
  {
    slug: "mental-health-analysis",
    title: "Mental Health Data Analysis",
    subtitle: "Data Analysis & Visualization Project",
    period: "Feb 2026 – Mar 2026",
    points: [
      "Performed mental health data analysis using Python, NumPy, Pandas, and Seaborn for cleaning and EDA.",
      "Created 12+ visualizations (distributions, box plots, scatter plots, pie charts, heatmaps) to uncover mental health trends.",
      "Applied statistical techniques to identify key correlations and outliers, translating findings into actionable insights on mental health patterns.",
    ],
    stack: ["Python", "NumPy", "Pandas", "Seaborn", "Matplotlib"],
  },
];

const certificates = [
  {
    name: "Data Analytics Job Simulation",
    issuer: "Deloitte · Forage",
    date: "Jun 2026",
    image: deloitteCert,
  },
  {
    name: "Oracle Cloud Infrastructure 2025 – AI Foundations Associate",
    issuer: "Oracle University",
    date: "Mar 2026",
    image: oracleAiCert,
  },
  {
    name: "Oracle Data Platform 2025 – Foundations Associate",
    issuer: "Oracle University",
    date: "Mar 2026",
    image: oracleDataCert,
  },
  {
    name: "Power BI Workshop",
    issuer: "OfficeMaster",
    date: "Feb 2026",
    image: powerbiCert,
  },
  {
    name: "Data Structures & Algorithms in Python",
    issuer: "Infosys Springboard",
    date: "Sep 2025",
    image: infosysCert,
  },
  {
    name: "AINCAT 2026 – Certificate of Participation",
    issuer: "Naukri Campus",
    date: "Jun 2026",
    image: ncatCert,
  },
  {
    name: "Certificate of Merit – Fundamentals of Data Structures",
    issuer: "Centre for Professional Enhancement, LPU",
    date: "Aug 2026",
    image: lpuMeritCert,
  },
];

const achievements = [
  {
    icon: "🏆",
    title: "NCAT Top Ranker",
    stat: "#10,735",
    sub: "out of 4.7 lakh+ participants",
    desc: "Secured Rank 10,735 in the Naukri Campus Aptitude Test (NCAT), Jun 2026.",
    color: "from-amber-500/15 to-yellow-500/10",
    border: "border-amber-500/20",
    glow: "rgba(245,158,11,0.15)",
  },
  {
    icon: "🎓",
    title: "Multi-Platform Certifications",
    stat: "7+",
    sub: "industry certifications earned",
    desc: "Certified in AI, Data Platforms, Power BI, and DSA from Oracle, Infosys, Deloitte & Microsoft (Sep 2025 – Jun 2026).",
    color: "from-indigo-500/15 to-violet-500/10",
    border: "border-indigo-500/20",
    glow: "rgba(99,102,241,0.15)",
  },
];

const education = [
  {
    school: "Lovely Professional University",
    place: "Phagwara, Punjab",
    detail: "Bachelor of Technology – Computer Science and Engineering; CGPA: 7.00",
    period: "Aug 2024 – Present",
  },
  {
    school: "Sri Chaitanya Junior College",
    place: "Tirupathi, Andhra Pradesh",
    detail: "Senior Secondary; CGPA: 8.7",
    period: "Apr 2022 – Mar 2024",
  },
  {
    school: "Sri Chaitanya Techno School",
    place: "Punganur, Andhra Pradesh",
    detail: "Schooling; CGPA: 7.3",
    period: "Apr 2021 – Mar 2022",
  },
];

const Index = () => {
  const [activeCert, setActiveCert] = useState<(typeof certificates)[number] | null>(null);
  const [data, setData] = useState<AdminData>(getAdminData());

  useEffect(() => {
    return subscribeToPortfolioData((updated) => {
      setData(updated);
    });
  }, []);

  return (
    <Layout hasHero>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

        <div className="container relative z-10 text-center py-28">
          <HeroContent className="flex flex-col gap-5 max-w-4xl mx-auto items-center">
            <HeroItem>
              <p className="text-sm font-medium tracking-[0.3em] uppercase text-white/70">
                {data.profile.tagline}
              </p>
            </HeroItem>
            <HeroItem>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white">
                {data.profile.name}
              </h1>
            </HeroItem>
            <HeroItem>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                {data.profile.bio}
              </p>
            </HeroItem>
            <HeroItem>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                <a
                  href={`mailto:${data.profile.email}`}
                  className="inline-flex items-center gap-2 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all duration-300 px-7 py-3"
                >
                  <Mail className="w-4 h-4" />
                  Email Me
                </a>
                <a
                  href={data.profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 px-7 py-3"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
                <a
                  href={data.profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 px-7 py-3"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </div>
            </HeroItem>
            <HeroItem>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/70 mt-2">
                <span className="inline-flex items-center gap-2">
                  <Phone className="w-4 h-4" /> {data.profile.phone}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {data.profile.email}
                </span>
              </div>
            </HeroItem>
          </HeroContent>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-24 md:py-32">
        <div className="container">
          <SectionHeader className="mb-14">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">
              What I Work With
            </p>
            <h2 className="text-3xl md:text-4xl tracking-tight font-normal">Skills</h2>
          </SectionHeader>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.skills.map((group) => (
              <StaggerItem key={group.title}>
                <div className="h-full p-7 rounded-3xl bg-card border border-border">
                  <h3 className="text-lg font-medium mb-4">{group.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <SkillChip key={item} name={item} />
                    ))}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-24 md:py-32 bg-black text-white">
        <div className="container">
          <SectionHeader className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-8">
              <Code2 className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-white/60 mb-4">Projects</p>
            <h2 className="text-4xl md:text-5xl tracking-tight font-normal">Things I have built</h2>
          </SectionHeader>

          <StaggerContainer className="grid grid-cols-1 gap-6">
            {data.projects.map((project) => (
              <StaggerItem key={project.title}>
                <article className="p-8 md:p-10 rounded-4xl bg-white/5 hover:bg-white/10 transition-all duration-500">
                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-5">
                    <div>
                      <h3 className="text-2xl font-normal">{project.title}</h3>
                      <p className="text-white/60 text-sm mt-1">{project.subtitle}</p>
                    </div>
                    <span className="text-xs uppercase tracking-wider text-white/50">{project.period}</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {project.points.map((point) => (
                      <li key={point} className="flex gap-3 text-white/70 text-sm leading-relaxed">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <span key={tech} className="text-xs px-3 py-1.5 rounded-full bg-white/10 text-white/80">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/projects/${project.slug}`}
                      className="group/link inline-flex items-center gap-2 text-sm font-medium text-white hover:gap-3 transition-all duration-300"
                    >
                      View project
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Training */}
      <section id="training" className="py-24 md:py-32">
        <div className="container max-w-4xl">
          <SectionHeader className="mb-12">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Training
            </p>
            <h2 className="text-3xl md:text-4xl tracking-tight font-normal">
              Fundamentals of Data Structures
            </h2>
          </SectionHeader>

          <FadeUp>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              <div className="p-8 rounded-3xl bg-card border border-border">
                <div className="flex flex-col gap-2 mb-5">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">Centre for Professional Enhancement, LPU</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Jun 2026 – Jul 2026 · Grade A</span>
                </div>
                <ul className="space-y-3 text-muted-foreground text-sm leading-relaxed">
                  <li>
                    Gained strong knowledge of core DSA: arrays, linked lists, stacks, queues, trees, graphs,
                    sorting and searching.
                  </li>
                  <li>
                    Developed problem-solving skills by implementing efficient data structures and analyzing
                    time complexity.
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => setActiveCert(certificates[certificates.length - 1])}
                className="group rounded-3xl overflow-hidden border border-border bg-muted"
              >
                <img
                  src={lpuMeritCert}
                  alt="Certificate of Merit for Fundamentals of Data Structures from Lovely Professional University"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </button>
            </div>
          </FadeUp>

        </div>
      </section>

      {/* Certificates */}
      <section id="certificates" className="py-24 md:py-32 bg-secondary/30">
        <div className="container">
          <SectionHeader className="text-center mb-14">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-background border border-border mb-6">
              <Award className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Verified Credentials
            </p>
            <h2 className="text-3xl md:text-4xl tracking-tight font-normal">Certificates</h2>
            <p className="text-muted-foreground mt-4">Click any certificate to view it full size.</p>
          </SectionHeader>

          <CertificatesSlideshow
            certificates={certificates}
            onSelectCert={setActiveCert}
          />
        </div>
      </section>

      {/* Certificate Lightbox */}
      <Dialog open={!!activeCert} onOpenChange={(open) => !open && setActiveCert(null)}>
        <DialogContent className="max-w-4xl p-2 sm:p-4">
          <DialogTitle className="sr-only">{activeCert?.name}</DialogTitle>
          {activeCert && (
            <div>
              <img
                src={activeCert.image}
                alt={`${activeCert.name} certificate issued by ${activeCert.issuer}`}
                className="w-full h-auto rounded-xl"
              />
              <div className="px-2 py-4">
                <p className="font-medium">{activeCert.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeCert.issuer} · {activeCert.date}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Achievements */}
      <section id="achievements" className="py-24 md:py-32 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(99,102,241,0.04),transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(to right,#888 1px,transparent 1px),linear-gradient(to bottom,#888 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="container max-w-5xl relative z-10">
          <SectionHeader className="mb-14">
            <p className="text-xs font-mono tracking-[0.25em] uppercase text-muted-foreground mb-3">Recognition</p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Achievements</h2>
            </div>
          </SectionHeader>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.achievements.map((item, idx) => {
              const style = achievementStyles[idx % achievementStyles.length];
              return (
                <StaggerItem key={item.title + idx}>
                  <div
                    className={`group relative rounded-3xl border ${style.border} bg-gradient-to-br ${style.color} p-7 overflow-hidden hover:scale-[1.02] transition-all duration-300`}
                    style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.04) inset, 0 8px 32px ${style.glow}` }}
                  >
                    {/* Top gloss */}
                    <span className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    {/* Glow blob */}
                    <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-40"
                      style={{ background: style.glow }} />

                    <div className="relative flex items-start gap-5">
                      <div className="text-3xl mt-0.5">{item.icon}</div>
                      <div className="flex-1">
                        <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground mb-2">{item.title}</p>
                        <p className="text-4xl font-bold tracking-tight mb-1">{item.stat}</p>
                        <p className="text-sm text-muted-foreground mb-4">{item.sub}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>


      {/* Education */}
      <section id="education" className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_50%,rgba(139,92,246,0.04),transparent)]" />
        <div className="container max-w-5xl relative z-10">
          <SectionHeader className="mb-14">
            <p className="text-xs font-mono tracking-[0.25em] uppercase text-muted-foreground mb-3">Academic Background</p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20">
                <GraduationCap className="w-5 h-5 text-violet-400" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Education</h2>
            </div>
          </SectionHeader>

          <StaggerContainer className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-violet-500/40 via-border/60 to-transparent hidden md:block" />

            <div className="flex flex-col gap-5">
              {data.education.map((edu, i) => (
                <StaggerItem key={edu.school + i}>
                  <div className="group relative flex gap-6 md:pl-14">
                    {/* Timeline dot */}
                    <div className={`absolute left-0 top-6 hidden md:flex h-10 w-10 items-center justify-center rounded-full border-2 z-10 transition-all duration-300 group-hover:scale-110 ${
                      i === 0
                        ? "border-violet-500 bg-violet-500/10 text-violet-400"
                        : "border-border bg-background text-muted-foreground"
                    }`}>
                      <span className="text-xs font-bold">{data.education.length - i}</span>
                    </div>

                    {/* Card */}
                    <div className={`flex-1 rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg group-hover:border-border relative overflow-hidden ${
                      i === 0
                        ? "border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-background"
                        : "border-border/50 bg-card hover:bg-card/80"
                    }`}>
                      {i === 0 && (
                        <span className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-semibold">{edu.school}</h3>
                            {i === 0 && (
                              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">Current</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{edu.detail}</p>
                        </div>
                        <div className="flex-shrink-0 sm:text-right">
                          <p className="text-sm font-medium">{edu.place}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{edu.period}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-black text-white">
        <div className="container text-center">
          <SectionHeader className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl tracking-tight font-normal mb-6">
              Open to internships and entry-level roles
            </h2>
            <p className="text-white/70 text-lg mb-10">
              Interested in data analytics, machine learning and full-stack development roles.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all duration-300 hover:gap-4 px-8 py-3.5"
            >
              Get in Touch
              <ArrowRight className="w-5 h-5" />
            </Link>
          </SectionHeader>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
