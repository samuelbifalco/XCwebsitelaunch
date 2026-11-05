/**
 * Analytics-ready event helper. Pushes to window.dataLayer (GTM), calls gtag
 * and plausible when present, and emits a DOM event other tools can listen to.
 * No third-party script is loaded by default.
 */
type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, opts?: { props?: Props }) => void;
  }
}

export function track(event: string, props: Props = {}) {
  if (typeof window === "undefined") return;
  const payload = { event, ...props };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  window.gtag?.("event", event, props);
  window.plausible?.(event, { props });
  window.dispatchEvent(new CustomEvent("xc:track", { detail: payload }));
  if (process.env.NODE_ENV !== "production") console.debug("[track]", payload);
}
