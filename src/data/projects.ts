import talentforgeImg from "@/assets/projects/project-talentforge.png";
import bitenowImg from "@/assets/projects/project-bitenow.png";
import mentalHealthImg from "@/assets/projects/project-mental-health.png";

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  period: string;
  overview: string;
  image: string;
  imageAlt: string;
  stack: string[];
  built: { heading: string; detail: string }[];
  highlights: string[];
}

export const projects: Project[] = [
  {
    slug: "talentforge",
    title: "TalentForge",
    subtitle: "AI-Assisted Placement Preparation Desktop App (Java)",
    period: "Jun 2026 – Jul 2026",
    overview:
      "TalentForge is a desktop application that helps students prepare for campus placements in one place — coding practice, resume analysis, mock interviews and progress analytics, all wrapped in a modern, animated Java Swing interface.",
    image: talentforgeImg,
    imageAlt: "TalentForge login screen showing the AI-powered placement platform welcome page",
    stack: ["Java", "Swing", "SQLite", "Apache PDFBox", "FlatLaf"],
    built: [
      {
        heading: "UI/UX & app architecture",
        detail:
          "Designed the complete interface and Java Swing architecture for a multi-module placement-prep desktop app, including an animated login/signup flow and a FlatLaf-themed dashboard with light/dark styling.",
      },
      {
        heading: "Persistent data layer",
        detail:
          "Built a 14-table SQLite database layer that persists user accounts, practice stats and skill-tracking data across sessions.",
      },
      {
        heading: "AI resume checker",
        detail:
          "Deployed a Trie-based Resume Checker that parses PDF resumes with Apache PDFBox and scores them against a keyword bank for ATS-friendly feedback.",
      },
      {
        heading: "Analytics dashboard",
        detail:
          "Implemented an analytics dashboard with bar, donut and sparkline charts to visualize user progress, rankings and preparation streaks.",
      },
    ],
    highlights: [
      "Multi-module desktop app: coding practice, resume analysis, mock interviews",
      "14-table SQLite schema with full persistence",
      "Animated authentication flow and themed dashboard",
      "Trie-based keyword matching for instant resume scoring",
    ],
  },
  {
    slug: "bitenow",
    title: "BiteNow",
    subtitle: "Full-Stack Food Delivery Website",
    period: "May 2026 – Jun 2026",
    overview:
      "BiteNow is a full-stack food delivery platform with three live roles — Customer, Rider and Admin. It supports real-time order tracking, in-app chat and push notifications, from placing an order to doorstep delivery.",
    image: bitenowImg,
    imageAlt: "BiteNow food delivery homepage with hero banner, kitchen stats and category filters",
    stack: ["React 19", "Vite 7", "Tailwind CSS v4", "Supabase", "Realtime"],
    built: [
      {
        heading: "Full-stack platform",
        detail:
          "Built a complete food delivery platform with Customer, Rider and Admin experiences, including real-time tracking, chat and push notifications.",
      },
      {
        heading: "Modern frontend stack",
        detail:
          "Engineered the app with TanStack Start (React 19 + Vite 7) and Tailwind CSS v4 for a fast, fully typed, responsive UI.",
      },
      {
        heading: "Backend & realtime",
        detail:
          "Powered by Supabase — Postgres database, authentication and realtime subscriptions keep orders, chats and statuses in sync across all roles.",
      },
      {
        heading: "Role-based access control",
        detail:
          "Designed role-based access control and order-state management so Customer, Rider and Admin workflows stay secure and synchronized end to end.",
      },
    ],
    highlights: [
      "Three synchronized roles: Customer, Rider, Admin",
      "Real-time order tracking, chat and push notifications",
      "Role-based access control across every dashboard",
      "Location-aware discovery of local kitchens",
    ],
  },
  {
    slug: "mental-health-analysis",
    title: "Mental Health Data Analysis",
    subtitle: "Data Analysis & Visualization Project",
    period: "Feb 2026 – Mar 2026",
    overview:
      "An exploratory data analysis of mental health survey data — stress, sleep, depression, anxiety, burnout and lifestyle habits — turning raw responses into clear, visual insights about what affects mental well-being.",
    image: mentalHealthImg,
    imageAlt: "Mental health data analysis dashboard with twelve charts including distributions, scatter plots and a correlation heatmap",
    stack: ["Python", "NumPy", "Pandas", "Seaborn", "Matplotlib"],
    built: [
      {
        heading: "Data cleaning & EDA",
        detail:
          "Performed end-to-end analysis with Python, NumPy and Pandas — cleaning messy survey data, engineering features and running exploratory analysis.",
      },
      {
        heading: "Visualization suite",
        detail:
          "Created 12+ visualizations — distributions, box plots, scatter plots, pie charts and heatmaps — to uncover trends in stress, sleep, screen time and lifestyle habits.",
      },
      {
        heading: "Statistical insights",
        detail:
          "Applied statistical techniques to identify key correlations and outliers, such as the strong link between sleep hours and stress level, translating findings into actionable insights on mental health patterns.",
      },
    ],
    highlights: [
      "12+ charts covering distributions, correlations and lifestyle factors",
      "Correlation heatmap across 8 mental-health variables",
      "Clear narrative: sleep and physical activity strongly buffer stress",
      "Fully reproducible Python analysis notebook",
    ],
  },
];
