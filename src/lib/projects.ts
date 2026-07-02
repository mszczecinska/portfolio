export interface Project {
  slug: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  content: string;
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
    image: "/assets/multiplatform/multi-work.png",
    tags: ["UI Design", "Design system", "Web", "E-commerce"],
    content:
      "Case study projektu design systemu dla dwóch platform e-commerce.",
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
    image: "/assets/akademia/work-akademia.png",
    tags: ["UX/UI Design", "E-commerce", "EduTech"],
    content:
      "Akademia to sklep z e-bookami edukacyjnymi zaprojektowany jako subaplikacja strony Studio Nauczania Justyna Magiera. Projekt miał przenieść charakter marki do bardziej przejrzystego i nowoczesnego interfejsu, który lepiej odpowiada potrzebom sklepu internetowego.",
  },
  {
    slug: "szczecinska-design-portfolio",
    title: "szczecinska.design - case study portfolio",
    description:
      "Własne portfolio zaprojektowane i wdrożone od zera: visual direction, case studies, motion i wynik Lighthouse 100/100.",
    image: "/assets/portfolio/portfolio-work.png",
    tags: ["UX/UI Design", "Development", "Web", "Motion Design"],
    content:
      "Portfolio to jeden z trudniejszych projektów, jakie mogę sobie zlecić. Jest jednocześnie produktem i wizytówką, a każda decyzja projektowa staje się od razu dowodem na to, jak myślę o designie.",
  },
  {
    slug: "miropoix-saas-dla-szefow-kuchni",
    title: "Miropoix - landing page aplikacji SaaS",
    description:
      "Redesign SaaS dla zespołów kuchennych: nowa warstwa UI, animacje, landing page i wdrożona strona.",
    image: "/assets/miropoix/work-miropoix.png",
    tags: ["UI Design", "Development", "Web", "Motion Design"],
    content:
      "Miropoix to aplikacja SaaS skierowana do zespołów kuchennych. Aplikacja daje zespołowi jedno wspólne narzędzie, w którym każdy kucharz dodaje to, co potrzebuje danego dnia.",
  },
  {
    slug: "koncepcja-wizji-produktu-b2c",
    title: "INX - wizja produktu B2C",
    description:
      "Research i strategia produktu B2C dla crypto analytics: hipotezy, persony, JTBD i finalna wizja InfoFi workspace.",
    image: "/assets/inx/work-inx.png",
    tags: ["UX Design", "FinTech", "Research"],
    content:
      "Projekt koncepcyjno-researchowy dla InsightX: od silnika B2B do kierunku produktu B2C dla Smart Traderów. Efektem była wizja InfoFi, łącząca dane on-chain, giełdowe i AI w research-ready workspace.",
  },
  {
    slug: "readyset-aplikacja-do-planowania-wyjazdow",
    title: "ReadySet - aplikacja do planowania wyjazdów",
    description:
      "Koncept aplikacji mobilnej do planowania wyjazdów: research, flow, głosowanie, komentarze i generowany harmonogram.",
    image: "/assets/ready-set/work-readyset.png",
    tags: ["UX/UI Design", "Mobile", "Travel"],
    content:
      "Aplikacja mobilna do wspólnego planowania wyjazdów. Umożliwia tworzenie planów ze znajomymi, dodawanie spersonalizowanych kategorii i formularzy, wspólne głosowanie na opcje oraz prowadzenie rozmów w komentarzach przypiętych do konkretnych kategorii.",
  },
  {
    slug: "mova-aplikacja-do-nauki-jezykow",
    title: "Mova - aplikacja do nauki języków",
    description:
      "Koncept aplikacji mobile i web do nauki języków: struktura lekcji, progres, feedback i skalowalny UI Kit.",
    image: "/assets/mova/work-mova.png",
    tags: ["UX/UI Design", "Web & Mobile", "EduTech"],
    content:
      "Nowoczesna platforma do nauki języków obcych. Zaprojektowana z myślą o użytkownikach poszukujących skutecznego i angażującego sposobu na rozwijanie umiejętności językowych. Dostępna zarówno w formie aplikacji mobilnej jak i wersji webowej.",
  },
  {
    slug: "aurapura-design-system",
    title: "AuraPura - projekt design systemu",
    description:
      "Design system e-commerce zbudowany od fundamentów: tokeny, Figma Variables, komponenty i responsywne layouty.",
    image: "/assets/aurapura/work-aurapura.png",
    tags: ["UI Design", "Design system", "Web", "E-commerce"],
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
