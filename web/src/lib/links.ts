/** Verified destination URLs on xactaclaim.com (checked Nov 2026). */
export const LINKS = {
  home: "https://xactaclaim.com",
  register: "https://xactaclaim.com/register",
  pricing: "https://xactaclaim.com/pricing",
  features: "https://xactaclaim.com/features",
  demo: "https://xactaclaim.com/demo",
  solutions: "https://xactaclaim.com/solutions",
  security: "https://xactaclaim.com/security",
  login: "https://xactaclaim.com/login",
  contact: "https://xactaclaim.com/contact",
  privacy: "https://xactaclaim.com/privacy",
  terms: "https://xactaclaim.com/terms",
} as const;

/** Adds campaign parameters so conversions from this experience are attributable. */
export function withUtm(url: string, content: string) {
  const u = new URL(url);
  u.searchParams.set("utm_source", "cinematic-site");
  u.searchParams.set("utm_medium", "referral");
  u.searchParams.set("utm_campaign", "disaster-to-clarity");
  u.searchParams.set("utm_content", content);
  return u.toString();
}
