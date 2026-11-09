import { projects } from "./projects";

// Preserve the same order for listings and case-study navigation.
const toCard = (project: (typeof projects)[number]) => ({
  slug: project.slug,
  ...project.card,
});

export const projectCards = projects.filter(project => project.category === "projects").map(toCard);
export const experimentCards = projects.filter(project => project.category === "experiments").map(toCard);
export const featuredCards = projects.filter(project => project.featured).map(toCard);
