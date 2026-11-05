# XactaClaim — "From Disaster to Clarity"

A cinematic, single-page marketing experience for [XactaClaim](https://xactaclaim.com): a homeowner, a public adjuster, and the AI-assisted claim workspace that keeps the claim organized.

## Run it

```bash
cd web
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
```

Optional: set `NEXT_PUBLIC_SITE_URL` to the deployed URL so canonical/OG URLs resolve correctly (defaults to https://xactaclaim.com).

**Not deployed** — waiting for approval.

## Story & sections

| # | Section | What happens |
|---|---------|--------------|
| 1 | Hero — *When Disaster Strikes, Clarity Matters.* | Full-screen Higgsfield video of the storm-damaged house, rain, lightning, mouse-drift; scroll pushes the camera in. |
| 2 | Chaos — *Every Claim Has a Thousand Moving Parts.* | Pinned scene: photos, letters, texts, voicemails and estimates fly in around the house until it feels overwhelming. |
| 3 | Adjuster — *Expertise Makes the Difference.* | Clip-path reveal of the adjuster + homeowner, viewfinder brackets, grid "structure" overlay. |
| 4 | Workspace — *One Workspace. Every Claim.* | The same claim items fly into a 3D screen that rises flat and becomes the **real XactaClaim UI**; six capabilities scrub with scroll (clickable / arrow keys). |
| 5 | Journey | Interactive Inspect → Document → Review → Organize → Progress (hover/click/keyboard), glowing progress line. Labeled as an illustration. |
| 6 | People — *Better Tools. More Confidence.* | Split screen: reassured homeowner (Higgsfield) vs. XactaClaim product film, glowing seam. |
| 7 | Finale — *Clarity in Every Claim.* | Same camera angle: storm → soft daylight wipe (house still damaged, tarped). Giant magnetic **Discover XactaClaim** CTA + accurate plan cards. |

## Accuracy notes

- Copy, feature names and plan availability come from xactaclaim.com (home, /features, /pricing), checked Nov 2026: Solo $0 (1 trial claim, 1 live AI action), Pro $19.99/mo, Pro+ $34.99/mo (estimate comparison + demand drafting are Pro+). "When configured" caveats for SMS/voice are kept.
- No invented testimonials, results or statistics. AI is described as assisting the adjuster, never making coverage determinations.
- Product screens are frames from XactaClaim's own product film (`/videos/..._xactaclaim_final.mp4` on xactaclaim.com). No UI was invented.
- The footer discloses that people/property scenes are AI-generated dramatizations.

## CTAs (all verified 200)

`https://xactaclaim.com`, `/register`, `/pricing`, `/features`, `/demo`, `/solutions`, `/security`, `/login`, `/contact`, `/privacy`, `/terms` — each tagged with `utm_source=cinematic-site&utm_campaign=disaster-to-clarity&utm_content=<placement>`.

## Analytics

`web/src/lib/analytics.ts` → `track(event, props)` pushes to `window.dataLayer`, calls `gtag`/`plausible` if present, and dispatches a `xc:track` DOM event. Events: `cta_click`, `experience_start`, `capability_select`, `journey_stage`, `plan_click`, `motion_toggle`. No tracking script is bundled.

## Higgsfield assets (generated in this build)

All 12 available credits were used; nothing purchased.

| File | Model | Credits | Prompt summary |
|------|-------|---------|----------------|
| `house_storm` | GPT Image 2.6 (medium, 2K) | 1 | Suburban house after a storm, realistic damage, navy grade |
| `hero_storm.mp4` | Kling 3.0 std, 5 s, silent, image-to-video from `house_storm` | 6.25 | Slow dolly push-in, wind, drizzle — encoded as a seamless forward/reverse loop |
| `duo_concerned` | GPT Image 2.6 (medium, 2K) | 1 | Worried homeowner + adjuster with tablet |
| `duo_reassured` | GPT Image 2.6 (medium, 2K), ref `duo_concerned` | 1 | Same two people, reassured, reviewing tablet |
| `house_day` | GPT Image 2.6 (medium, 2K), ref `house_storm` | 1 | Same angle, morning light, still damaged/tarped |
| `docs_chaos` | GPT Image 2.6 (medium, 2K) | 1 | Claim paperwork flat-lay (available in `/media`, not currently placed) |
| `dmg_roof`, `dmg_gutter`, `dmg_branch` | GPT Image 2.6 (low, 1K) | 0.75 | Smartphone-style damage evidence photos |

Mobile (9:16) crops were made for the house, people and hero video. Images are WebP; videos are H.264 `+faststart`, muted, no audio track.

## Performance & accessibility

- Hero poster preloaded; video picked by aspect ratio after mount; product film lazy-loaded via IntersectionObserver and paused off-screen.
- Rain canvas pauses off-screen; long pinned scenes (Adjuster, Workspace) pin only at ≥1024px and use a stacked layout on phones.
- Reduced motion: follows `prefers-reduced-motion`, plus a visitor toggle (persisted). Disables Lenis, pins, video autoplay, rain and reveal animations; every section has a readable static state.
- Semantic landmarks, skip link, ARIA tabs with arrow-key support, alt text on all story images, visible focus rings.
