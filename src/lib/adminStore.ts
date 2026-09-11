// ─── Admin Store ───────────────────────────────────────────────────────────────
// Stores the admin PIN and all editable portfolio data in localStorage.
// Index.tsx reads from this store and falls back to hardcoded defaults.

const PIN_KEY = "portfolio_admin_pin";
const DATA_KEY = "portfolio_admin_data";
const RESET_TOKEN_KEY = "portfolio_reset_token";

export const DEFAULT_PIN = "1369";

// ── PIN helpers ────────────────────────────────────────────────────────────────
export function getPin(): string {
  return (localStorage.getItem(PIN_KEY) || DEFAULT_PIN).trim();
}

export function checkPin(input: string): boolean {
  return input.trim() === getPin();
}

export function setPin(newPin: string): void {
  const sanitized = newPin.trim();
  localStorage.setItem(PIN_KEY, sanitized);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("portfolio_pin_updated", { detail: sanitized }));
  }
}

// ── Reset token helpers ────────────────────────────────────────────────────────
export interface ResetToken {
  code: string;
  expiresAt: number; // ms timestamp
}

export function generateResetToken(): ResetToken {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes validity
  const token: ResetToken = { code, expiresAt };
  localStorage.setItem(RESET_TOKEN_KEY, JSON.stringify(token));
  return token;
}

export function verifyResetToken(input: string): boolean {
  const raw = localStorage.getItem(RESET_TOKEN_KEY);
  if (!raw) return false;
  try {
    const token: ResetToken = JSON.parse(raw);
    if (Date.now() > token.expiresAt) {
      localStorage.removeItem(RESET_TOKEN_KEY);
      return false;
    }
    return input.trim() === token.code;
  } catch {
    return false;
  }
}

export function clearResetToken(): void {
  localStorage.removeItem(RESET_TOKEN_KEY);
}

// ── Editable portfolio data ───────────────────────────────────────────────────
export interface ProjectItem {
  slug: string;
  title: string;
  subtitle: string;
  period: string;
  points: string[];
  stack: string[];
}

export interface AdminData {
  profile: {
    name: string;
    tagline: string;
    bio: string;
    email: string;
    phone: string;
    location: string;
    github: string;
    linkedin: string;
  };
  achievements: { icon: string; title: string; stat: string; sub: string; desc: string }[];
  education: { school: string; place: string; detail: string; period: string }[];
  skills: { title: string; items: string[] }[];
  projects: ProjectItem[];
}

export const DEFAULT_DATA: AdminData = {
  profile: {
    name: "Yannabathula Varshith Reddy",
    tagline: "B.Tech CSE · Data & Software",
    bio: "Computer Science undergraduate at Lovely Professional University, building data-driven applications with Python, Java and modern web technologies.",
    email: "yannabathulavarshithreddy7@gmail.com",
    phone: "+91 91772 75881",
    location: "Phagwara, Punjab, India",
    github: "https://github.com/varshith1369",
    linkedin: "https://www.linkedin.com/in/varshithreddy07/",
  },
  achievements: [
    {
      icon: "🏆",
      title: "NCAT Top Ranker",
      stat: "#10,735",
      sub: "out of 4.7 lakh+ participants",
      desc: "Secured Rank 10,735 in the Naukri Campus Aptitude Test (NCAT), Jun 2026.",
    },
    {
      icon: "🎓",
      title: "Multi-Platform Certifications",
      stat: "7+",
      sub: "industry certifications earned",
      desc: "Certified in AI, Data Platforms, Power BI, and DSA from Oracle, Infosys, Deloitte & Microsoft (Sep 2025 – Jun 2026).",
    },
  ],
  education: [
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
  ],
  skills: [
    { title: "Programming Languages", items: ["Python", "SQL", "C++", "Java"] },
    { title: "Data Science", items: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Data Cleaning", "EDA", "Feature Engineering"] },
    { title: "Machine Learning", items: ["scikit-learn", "Classification", "Regression", "Data Preprocessing"] },
    { title: "Visualization & Analysis", items: ["Power BI", "Tableau", "Excel"] },
    { title: "Web", items: ["HTML", "CSS", "JavaScript", "REST APIs"] },
    { title: "Databases", items: ["MongoDB", "Firebase", "Supabase", "MySQL"] },
    { title: "Tools & Platforms", items: ["Git", "GitHub", "Jupyter Notebook", "Google Colab", "VS Code", "Microsoft Copilot Studio"] },
    { title: "CS Fundamentals", items: ["DSA", "OS", "DBMS", "CN"] },
    { title: "Soft Skills", items: ["Analytical Thinking", "Communication", "Leadership", "Problem Solving"] },
  ],
  projects: [
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
  ],
};

export function getAdminData(): AdminData {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return DEFAULT_DATA;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_DATA,
      ...parsed,
      profile: { ...DEFAULT_DATA.profile, ...(parsed.profile || {}) },
      achievements: parsed.achievements?.length ? parsed.achievements : DEFAULT_DATA.achievements,
      education: parsed.education?.length ? parsed.education : DEFAULT_DATA.education,
      skills: parsed.skills?.length ? parsed.skills : DEFAULT_DATA.skills,
      projects: parsed.projects?.length ? parsed.projects : DEFAULT_DATA.projects,
    };
  } catch {
    return DEFAULT_DATA;
  }
}

export function saveAdminData(data: AdminData): void {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("portfolio_data_updated", { detail: data }));
  }
}

export function resetAdminData(): void {
  localStorage.removeItem(DATA_KEY);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("portfolio_data_updated", { detail: DEFAULT_DATA }));
  }
}

export function subscribeToPortfolioData(callback: (data: AdminData) => void): () => void {
  const handler = () => callback(getAdminData());
  if (typeof window !== "undefined") {
    window.addEventListener("portfolio_data_updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("portfolio_data_updated", handler);
      window.removeEventListener("storage", handler);
    };
  }
  return () => {};
}
