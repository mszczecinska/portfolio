export interface Project {
  slug: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  content: string;
  links?: {
    live?: string;
    github?: string;
  };
}

export const projects: Project[] = [
  {
    slug: "szczecinska-design-portfolio",
    title: "szczecinska.design - case study portfolio",
    description:
      "  Opis procesu projektowania i budowania portfolio od podstaw. Od pierwszych inspiracji i szkiców, przez makietę, po wdrwdroenie strony.",
    image: "/assets/portfolio/portfolio-work.png",
    tags: ["Product Design", "Development", "Personal project"],
    content:
      "Portfolio to jeden z trudniejszych projektów, jakie mogę sobie zlecić. Jest jednocześnie produktem i wizytówką, a każda decyzja projektowa staje się od razu dowodem na to, jak myślę o designie.",
  },
  {
    slug: "miropoix-saas-dla-szefow-kuchni",
    title: "Miropoix - SaaS dla szefów kuchni",
    description:
      "Miropoix to aplikacja SaaS skierowana do zespołów kuchennych. Aplikacja daje zespołowi jedno wspólne narzędzie, w którym każdy kucharz dodaje to, co potrzebuje danego dnia.",
    image: "/assets/miropoix/work-miropoix.png",
    tags: ["UI Design", "Web Design", "Motion Design", "SaaS"],
    content:
      "Miropoix to aplikacja SaaS skierowana do zespołów kuchennych. Aplikacja daje zespołowi jedno wspólne narzędzie, w którym każdy kucharz dodaje to, co potrzebuje danego dnia.",
  },
  {
    slug: "koncepcja-wizji-produktu-b2c",
    title: "INX - wizja produktu B2C",
    description:
      "Projekt koncepcyjno-researchowy dla InsightX: od silnika B2B do kierunku produktu B2C dla Smart Traderów. Efektem była wizja InfoFi, łącząca dane on-chain, giełdowe i AI w research-ready workspace.",
    image: "/assets/inx/work-inx.png",
    tags: ["UX Design", "Research", "Crypto / DeFi"],
    content:
      "Projekt koncepcyjno-researchowy dla InsightX: od silnika B2B do kierunku produktu B2C dla Smart Traderów. Efektem była wizja InfoFi, łącząca dane on-chain, giełdowe i AI w research-ready workspace.",
  },
  {
    slug: "readyset-aplikacja-do-planowania-wyjazdow",
    title: "ReadySet - aplikacja do planowania wyjazdów",
    description:
      "Aplikacja mobilna do wspólnego planowania wyjazdów. Umożliwia tworzenie planów ze znajomymi, dodawanie spersonalizowanych kategorii i formularzy, wspólne głosowanie na opcję, oraz prowadzenie rozmów w komentarzach przypiętych do konkretnych kategorii",
    image: "/assets/ready-set/work-readyset.png",
    tags: ["UX / UI Design", "Mobile app", "Travel", "End-to-end"],
    content:
      "Aplikacja mobilna do wspólnego planowania wyjazdów. Umożliwia tworzenie planów ze znajomymi, dodawanie spersonalizowanych kategorii i formularzy, wspólne głosowanie na opcję, oraz prowadzenie rozmów w komentarzach przypiętych do konkretnych kategorii",
  },
  {
    slug: "mova-aplikacja-do-nauki-jezykow",
    title: "Mova - aplikacja do nauki języków",
    description:
      "Nowoczesna platforma do nauki języków obcych. Zaprojektowana z myślą o użytkownikach poszukujących skutecznego i angażującego sposobu na rozwijanie umiejętności językowych. Dostępna zarówno w formie aplikacji mobilnej jak i wersji webowej, tak aby użytkownik miał możliwość skorzystania z niej w każdych okolicznościach.",
    image: "/assets/mova/work-mova.png",
    tags: ["UX / UI Design", "Web & Mobile", "Language app"],
    content:
      "Nowoczesna platforma do nauki języków obcych. Zaprojektowana z myślą o użytkownikach poszukujących skutecznego i angażującego sposobu na rozwijanie umiejętności językowych. Dostępna zarówno w formie aplikacji mobilnej jak i wersji webowej.",
  },
  {
    slug: "aurapura-design-system",
    title: "AuraPura - projekt design systemu",
    description:
      "AuraPura to projekt stworzony w ramach kursu Design system intro. Punktem wyjścia był brief marki, zapis wywiadu z klientem i zestaw assetów. Na tej podstawie miałam samodzielnie zbudować kompletny design system i doprowadzić go do finalnych widoków na trzech wielkościach ekranu.",
    image: "/assets/aurapura/work-aurapura.png",
    tags: ["UX / UI Design", "Design system", "E-commerce"],
    content:
      "AuraPura to projekt stworzony w ramach kursu Design system intro. Punktem wyjścia był brief marki, zapis wywiadu z klientem i zestaw assetów. Na tej podstawie miałam samodzielnie zbudować kompletny design system i doprowadzić go do finalnych widoków na trzech wielkościach ekranu.",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getAllProjects(): Project[] {
  return projects;
}
