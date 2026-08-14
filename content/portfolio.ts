import portfolio from "./portfolio.json";
import verifiedUrls from "./verified-urls.json";

export type Portfolio = typeof portfolio;
export type AiSystem = Portfolio["aiSystems"][number];
export type SelectedWork = Portfolio["selectedWork"][number];
export type Capture = AiSystem["capture"];
export type VerifiedUrls = typeof verifiedUrls;

/** The last path segment of a system route, which is the dynamic route parameter. */
export function systemSegment(system: AiSystem): string {
  return system.route.replace(/^\/systems\//, "");
}

export function systemBySegment(segment: string): AiSystem | undefined {
  return portfolio.aiSystems.find((system) => systemSegment(system) === segment);
}

/** Both captures a system publishes, primary first, with the empty slot dropped. */
export function systemCaptures(system: AiSystem): Capture[] {
  return [system.capture, system.secondaryCapture].filter(Boolean) as Capture[];
}

/** Systems whose hosted URL was observed answering 200, in ladder order. */
export function hostedSystems(): AiSystem[] {
  const reachable = new Set(
    verifiedUrls.checks
      .filter((check) => check.observed === 200)
      .map((check) => check.url.replace(/\/$/, "")),
  );
  return portfolio.aiSystems.filter(
    (system) => system.hosted !== null && reachable.has(system.hosted.url.replace(/\/$/, "")),
  );
}

export function cloneOnlySystems(): AiSystem[] {
  const hosted = new Set(hostedSystems().map((system) => system.slug));
  return portfolio.aiSystems.filter((system) => !hosted.has(system.slug));
}

export { verifiedUrls };
export default portfolio;
