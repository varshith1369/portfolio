import { Cpu } from "lucide-react";

// Simple Icons CDN: https://cdn.simpleicons.org/<slug>
const ICON_SLUGS: Record<string, string> = {
  Python: "python",
  SQL: "postgresql",
  "C++": "cplusplus",
  Java: "openjdk",
  Pandas: "pandas",
  NumPy: "numpy",
  Matplotlib: "python",
  Seaborn: "python",
  "Power BI": "powerbi",
  Tableau: "tableau",
  Excel: "microsoftexcel",
  HTML: "html5",
  CSS: "css3",
  JavaScript: "javascript",
  "REST APIs": "fastapi",
  MongoDB: "mongodb",
  Firebase: "firebase",
  Supabase: "supabase",
  MySQL: "mysql",
  Git: "git",
  GitHub: "github",
  "Jupyter Notebook": "jupyter",
  "Google Colab": "googlecolab",
  "VS Code": "visualstudiocode",
  "Microsoft Copilot Studio": "microsoftcopilot",
  "scikit-learn": "scikitlearn",
};

const SkillChip = ({ name }: { name: string }) => {
  const slug = ICON_SLUGS[name];

  return (
    <span className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground">
      {slug ? (
        <img
          src={`https://cdn.simpleicons.org/${slug}`}
          alt={`${name} logo`}
          loading="lazy"
          className="w-3.5 h-3.5 shrink-0"
          onError={(e) => {
            const img = e.currentTarget;
            img.style.display = "none";
            img.nextElementSibling?.classList.remove("hidden");
          }}
        />
      ) : null}
      <Cpu className={`w-3.5 h-3.5 shrink-0 text-muted-foreground ${slug ? "hidden" : ""}`} />
      {name}
    </span>
  );
};

export default SkillChip;
