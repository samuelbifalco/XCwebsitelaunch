/* Illustrative claim artifacts used in the scroll story. Generic, non-product content. */

export type Item = {
  id: string;
  kind: "photo" | "doc" | "sms" | "voicemail" | "estimate" | "note" | "email";
  x: number; // final scattered position, % of stage width (center)
  y: number; // % of stage height (center)
  r: number; // rotation deg
  depth: number; // 0.5 – 1.5 parallax depth
  mobile?: boolean; // show on small screens
  title?: string;
  body?: string;
  src?: string;
};

export const ITEMS: Item[] = [
  { id: "p1", kind: "photo", src: "/media/dmg_roof.webp", title: "IMG_2041.jpg · roof", x: 18, y: 26, r: -8, depth: 1.3, mobile: true },
  { id: "d1", kind: "doc", title: "Policy declarations", body: "Coverage A — Dwelling · Coverage B — Other structures · Deductible", x: 78, y: 22, r: 6, depth: 0.9, mobile: true },
  { id: "s1", kind: "sms", title: "Homeowner", body: "More photos of the ceiling — is this covered??", x: 70, y: 70, r: -4, depth: 1.4, mobile: true },
  { id: "e1", kind: "estimate", title: "Contractor estimate", x: 28, y: 72, r: 5, depth: 1.1, mobile: true },
  { id: "p2", kind: "photo", src: "/media/dmg_gutter.webp", title: "IMG_2057.jpg · gutter", x: 88, y: 48, r: 9, depth: 1.2 },
  { id: "v1", kind: "voicemail", title: "Voicemail · 0:52", body: "Missed call — homeowner", x: 12, y: 50, r: 3, depth: 0.8 },
  { id: "m1", kind: "email", title: "Re: Inspection appointment", body: "Can we move it to Thursday? The roofer…", x: 50, y: 14, r: -3, depth: 0.7 },
  { id: "p3", kind: "photo", src: "/media/dmg_branch.webp", title: "IMG_2063.jpg · driveway", x: 56, y: 82, r: -7, depth: 1.5, mobile: true },
  { id: "n1", kind: "note", body: "Call carrier back re: documentation request", x: 38, y: 34, r: -10, depth: 1.0 },
  { id: "d2", kind: "doc", title: "Carrier letter", body: "Request for additional documentation", x: 62, y: 38, r: 4, depth: 0.85 },
  { id: "d3", kind: "doc", title: "Receipt — emergency tarp", body: "Temporary roof protection", x: 90, y: 82, r: -5, depth: 1.05 },
  { id: "s2", kind: "sms", title: "Homeowner", body: "Mortgage company is asking for an update", x: 8, y: 84, r: 6, depth: 1.25 },
  // extra density (desktop only, Chaos scene)
  { id: "d4", kind: "doc", title: "Mortgage company letter", body: "Loss draft department — status request", x: 30, y: 15, r: 5, depth: 0.75 },
  { id: "m2", kind: "email", title: "Documentation request", body: "Please provide receipts and photos of…", x: 84, y: 31, r: -6, depth: 0.95 },
  { id: "s3", kind: "sms", title: "Homeowner", body: "Did you get the photos I sent last night?", x: 45, y: 62, r: 3, depth: 1.35 },
  { id: "v2", kind: "voicemail", title: "Voicemail · 1:14", body: "Contractor — scheduling", x: 66, y: 11, r: -4, depth: 0.8 },
  { id: "n2", kind: "note", body: "Moisture readings — attic??", x: 76, y: 58, r: 8, depth: 1.15 },
  { id: "e2", kind: "estimate", title: "Revised estimate", x: 38, y: 88, r: -4, depth: 0.9 },
];

export function ClaimCard({ item }: { item: Item }) {
  const base = "glass rounded-xl text-left text-[11px] leading-snug text-white/85 sm:text-[12px]";
  switch (item.kind) {
    case "photo":
      return (
        <figure className="w-[132px] rounded-md bg-[#f3f1ea] p-1.5 pb-2 shadow-[0_20px_50px_-12px_rgba(0,0,0,.85)] sm:w-[190px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.src} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-sm object-cover" />
          <figcaption className="mt-1.5 font-mono text-[9px] text-neutral-600 sm:text-[10px]">{item.title}</figcaption>
        </figure>
      );
    case "doc":
      return (
        <div className="w-[150px] rounded-md bg-[#eef2f7] p-3 text-[#13213a] shadow-[0_20px_50px_-12px_rgba(0,0,0,.85)] sm:w-[210px]">
          <div className="mb-2 h-1.5 w-10 rounded bg-electric/70" />
          <p className="text-[11px] font-semibold sm:text-[12px]">{item.title}</p>
          <p className="mt-1 text-[10px] text-[#13213a]/65 sm:text-[11px]">{item.body}</p>
          <div className="mt-2 space-y-1">
            {[90, 70, 82, 55].map((w, i) => (
              <div key={i} className="h-1 rounded bg-[#13213a]/15" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      );
    case "sms":
      return (
        <div className={`${base} w-[170px] p-3 sm:w-[220px]`}>
          <p className="mb-1.5 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-cyan/80">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" /> Text · {item.title}
          </p>
          <p className="rounded-2xl rounded-tl-sm bg-white/10 px-3 py-2">{item.body}</p>
        </div>
      );
    case "voicemail":
      return (
        <div className={`${base} w-[170px] p-3 sm:w-[210px]`}>
          <p className="font-mono text-[9px] uppercase tracking-wider text-cyan/80">{item.title}</p>
          <div className="my-2 flex h-6 items-end gap-[2px]">
            {Array.from({ length: 28 }).map((_, i) => (
              <span key={i} className="w-[3px] rounded-full bg-white/50" style={{ height: `${20 + Math.abs(Math.sin(i * 1.7)) * 80}%` }} />
            ))}
          </div>
          <p className="text-white/60">{item.body}</p>
        </div>
      );
    case "estimate":
      return (
        <div className="w-[170px] rounded-md bg-[#eef2f7] p-3 text-[#13213a] shadow-[0_20px_50px_-12px_rgba(0,0,0,.85)] sm:w-[230px]">
          <p className="text-[11px] font-semibold sm:text-[12px]">{item.title}</p>
          <table className="mt-2 w-full text-[9px] sm:text-[10px]">
            <tbody>
              {["Roof — shingles", "Gutters", "Interior — drywall", "Debris removal"].map((r) => (
                <tr key={r} className="border-t border-[#13213a]/10">
                  <td className="py-1">{r}</td>
                  <td className="py-1 text-right font-mono text-[#13213a]/40">— — —</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "note":
      return (
        <div className="w-[130px] bg-[#f6e27a] p-3 font-[family-name:var(--font-instrument-serif)] text-[14px] italic leading-tight text-[#3b3204] shadow-[0_20px_40px_-12px_rgba(0,0,0,.8)] sm:w-[150px] sm:text-[16px]">
          {item.body}
        </div>
      );
    case "email":
      return (
        <div className={`${base} w-[190px] p-3 sm:w-[250px]`}>
          <p className="font-mono text-[9px] uppercase tracking-wider text-cyan/80">Email · unread</p>
          <p className="mt-1 font-medium text-white">{item.title}</p>
          <p className="mt-0.5 text-white/55">{item.body}</p>
        </div>
      );
  }
}
