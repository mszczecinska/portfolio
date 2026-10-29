export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  comingSoon?: boolean;
  links?: {
    live?: string;
    github?: string;
  };
}

export const projects: Project[] = [
  {
    slug: "multiplatform-design-system",
    title: "Multiplatform design system",
    description:
      "Case study w przygotowaniu, ale już teraz możesz zobaczyć preview projektu.",
    tags: ["UI Design", "Design system", "Web", "E-commerce"],
    comingSoon: true,
    links: {
      live: "https://www.figma.com/design/Ggr7GFMPPOK58bETbzztxC/multiplatform_preview?node-id=3676-16",
    },
  },
  {
    slug: "akademia-e-commerce-dla-e-bookow-edukacyjnych",
    title: "Akademia - e-commerce dla e-booków",
    description:
      "Kompletna makieta e-commerce dla e-booków edukacyjnych: pełny flow zakupowy, desktop, mobile i uporządkowane zmienne w Figmie.",
    links: { live: "https://studionauczaniakursy.pl/" },
    tags: ["UX/UI Design", "E-commerce", "EduTech"],
  },
  {
    slug: "szczecinska-design-portfolio",
    title: "szczecinska.design - case study portfolio",
    description:
      "Własne portfolio zaprojektowane i wdrożone od zera: visual direction, case studies, motion i wynik Lighthouse 100/100.",
    tags: ["UX/UI Design", "Development", "Web", "Motion Design"],
  },
  {
    slug: "miropoix-saas-dla-szefow-kuchni",
    title: "Miropoix - landing page aplikacji SaaS",
    description:
      "Redesign SaaS dla zespołów kuchennych: nowa warstwa UI, animacje, landing page i wdrożona strona.",
    links: { live: "https://miropoix.com/en/" },
    tags: ["UI Design", "Development", "Web", "Motion Design"],
  },
  {
    slug: "koncepcja-wizji-produktu-b2c",
    title: "INX - wizja produktu B2C",
    description:
      "Research i strategia produktu B2C dla crypto analytics: hipotezy, persony, JTBD i finalna wizja InfoFi workspace.",
    tags: ["UX Design", "FinTech", "Research"],
  },
  {
    slug: "readyset-aplikacja-do-planowania-wyjazdow",
    title: "ReadySet - aplikacja do planowania wyjazdów",
    description:
      "Koncept aplikacji mobilnej do planowania wyjazdów: research, flow, głosowanie, komentarze i generowany harmonogram.",
    tags: ["UX/UI Design", "Mobile", "Travel"],
  },
  {
    slug: "mova-aplikacja-do-nauki-jezykow",
    title: "Mova - aplikacja do nauki języków",
    description:
      "Koncept aplikacji mobile i web do nauki języków: struktura lekcji, progres, feedback i skalowalny UI Kit.",
    tags: ["UX/UI Design", "Web & Mobile", "EduTech"],
  },
  {
    slug: "aurapura-design-system",
    title: "AuraPura - projekt design systemu",
    description:
      "Design system e-commerce zbudowany od fundamentów: tokeny, Figma Variables, komponenty i responsywne layouty.",
    tags: ["UI Design", "Design system", "Web", "E-commerce"],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getAllProjects(): Project[] {
  return projects;
}
