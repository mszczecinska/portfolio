export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  category: "projects" | "experiments";
  featured?: boolean;
  card: { title: string; badges: string; description: string };
  links?: {
    live?: string;
    github?: string;
  };
}

export const projects: Project[] = [
  {
    slug: "akademia-e-commerce-dla-e-bookow-edukacyjnych",
    category: "projects",
    featured: true,
    card: {
      title: "Akademia",
      badges: "UX/UI / E-COMMERCE / EDUTECH",
      description: "Od marki edukacyjnej do sklepu z e-bookami. Projekt UX/UI obejmujący pełną ścieżkę zakupową na desktopie i mobile.",
    },
    title: "Akademia - e-commerce dla e-booków",
    description:
      "Kompletna makieta e-commerce dla e-booków edukacyjnych: pełny flow zakupowy, desktop, mobile i uporządkowane zmienne w Figmie.",
    links: { live: "https://studionauczaniakursy.pl/" },
    tags: ["UX/UI Design", "E-commerce", "EduTech"],
  },
  {
    slug: "miropoix-saas-dla-szefow-kuchni",
    category: "projects",
    featured: true,
    card: {
      title: "Miropoix",
      badges: "UI / DEVELOPMENT / SAAS",
      description: "Nowa strona aplikacji dla zespołów kuchennych. Redesign landing page, motion i wdrożenie przy wsparciu narzędzi AI.",
    },
    title: "Miropoix - landing page aplikacji SaaS",
    description:
      "Redesign SaaS dla zespołów kuchennych: nowa warstwa UI, animacje, landing page i wdrożona strona.",
    links: { live: "https://miropoix.com/en/" },
    tags: ["UI Design", "Development", "Web", "Motion Design"],
  },
  {
    slug: "koncepcja-wizji-produktu-b2c",
    category: "projects",
    card: {
      title: "InsightX",
      badges: "UX / FINTECH / RESEARCH",
      description: "Od technologii B2B do wizji produktu B2C. Research, potrzeby traderów i koncepcja przestrzeni analitycznej InfoFi.",
    },
    title: "INX - wizja produktu B2C",
    description:
      "Research i strategia produktu B2C dla crypto analytics: hipotezy, persony, JTBD i finalna wizja InfoFi workspace.",
    tags: ["UX Design", "FinTech", "Research"],
  },
  {
    slug: "readyset-aplikacja-do-planowania-wyjazdow",
    category: "projects",
    card: {
      title: "ReadySet",
      badges: "UX/UI / MOBILE APP / TRAVEL",
      description: "Od rozproszonych pomysłów do wspólnego planu wyjazdu. Koncepcja aplikacji obejmująca research, UX/UI i prototyp.",
    },
    title: "ReadySet - aplikacja do planowania wyjazdów",
    description:
      "Koncept aplikacji mobilnej do planowania wyjazdów: research, flow, głosowanie, komentarze i generowany harmonogram.",
    tags: ["UX/UI Design", "Mobile", "Travel"],
  },
  {
    slug: "mova-aplikacja-do-nauki-jezykow",
    category: "projects",
    card: {
      title: "Mova",
      badges: "UX/UI / WEB & MOBILE / EDUTECH",
      description: "Czytelna ścieżka nauki języków. Projekt mobile i web ze strukturą lekcji, informacją o postępie i skalowalnym UI Kitem.",
    },
    title: "Mova - aplikacja do nauki języków",
    description:
      "Koncept aplikacji mobile i web do nauki języków: struktura lekcji, progres, feedback i skalowalny UI Kit.",
    tags: ["UX/UI Design", "Web & Mobile", "EduTech"],
  },
  {
    slug: "aurapura-design-system",
    category: "projects",
    card: {
      title: "AuraPura",
      badges: "UI / DESIGN SYSTEM / E-COMMERCE",
      description: "Od briefu marki do spójnego design systemu. Tokeny, Figma Variables, komponenty i widoki na trzy wielkości ekranu.",
    },
    title: "AuraPura - projekt design systemu",
    description:
      "Design system e-commerce zbudowany od fundamentów: tokeny, Figma Variables, komponenty i responsywne layouty.",
    tags: ["UI Design", "Design system", "Web", "E-commerce"],
  },
  {
    slug: "obrys-studio",
    category: "experiments",
    card: {
      title: "OBRYS Studio",
      badges: "VISUAL IDENTITY / WEB DESIGN / EXPLORATION",
      description: "Autorska koncepcja identyfikacji i strony studia wnętrzarskiego. Od znaku i typografii po spokojny interfejs i motion.",
    },
    title: "OBRYS Studio",
    description: "Autorska koncepcja identyfikacji wizualnej i strony OBRYS Studio: znak, typografia, fotografia i spokojny interfejs.",
    tags: ["Visual identity", "Web design", "Exploration"],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getAllProjects(): Project[] {
  return projects;
}
