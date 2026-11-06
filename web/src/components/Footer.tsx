import { LINKS, withUtm } from "@/lib/links";

const links = [
  ["Features", LINKS.features],
  ["Solutions", LINKS.solutions],
  ["Pricing", LINKS.pricing],
  ["Demo", LINKS.demo],
  ["Security", LINKS.security],
  ["Contact", LINKS.contact],
  ["Privacy", LINKS.privacy],
  ["Terms", LINKS.terms],
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-ink">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/xactaclaim-logo-light.png" alt="XactaClaim" width={160} height={34} className="h-8 w-auto" loading="lazy" />
          <p className="mt-4 text-sm text-white/50">
            AI-assisted claim workspace for public adjusters. XactaClaim is live in Early Access.
          </p>
        </div>
        <nav aria-label="XactaClaim links" className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm text-white/60 sm:grid-cols-4">
          {links.map(([l, h]) => (
            <a key={l} href={withUtm(h, `footer-${l.toLowerCase()}`)} target="_blank" rel="noopener" className="hover:text-white">
              {l}
            </a>
          ))}
        </nav>
      </div>
      <div className="mx-auto max-w-7xl px-5 pb-10 text-[11px] leading-relaxed text-white/35 sm:px-8">
        <p>
          Cinematic scenes, video, the trailer narration and score on this page are AI-generated dramatizations (created with Higgsfield). The people and property shown are not real customers.
          Product screens come from the official XactaClaim product film. AI features assist adjusters and do not make coverage determinations; messaging and
          voice features apply when configured. © {new Date().getFullYear()} XactaClaim.
        </p>
      </div>
    </footer>
  );
}
