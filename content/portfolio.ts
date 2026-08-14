import portfolio from "./portfolio.json";

export type Portfolio = typeof portfolio;
export type AiSystem = Portfolio["aiSystems"][number];
export type SelectedWork = Portfolio["selectedWork"][number];

export default portfolio;
