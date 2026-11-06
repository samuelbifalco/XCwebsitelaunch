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
| 7 | Finale — *Clarity in Every Claim.* | Same camera angle: scroll-scrubbed time-lapse from the storm to the same house fully restored at sunrise. Giant magnetic **Discover XactaClaim** CTA + accurate plan cards. |

## V2 enhancements (no new Higgsfield credits — built from existing footage and stills)

- **Hero:** layered depth parallax (video, far rain, near rain, copy move at different rates), shimmering headline, sheen on CTAs, velocity-reactive scroll cue; scroll pushes the camera into the front of the house and passes into darkness. The video pauses off-screen.
- **Chaos:** continues the same push-in from darkness; 18 claim items in three depth layers with pointer parallax, entering in waves from their nearest edge; inbox toasts with an unread counter; a held overload beat; then everything converges into a point of light.
- **Adjuster:** a pinned three-scene sequence (Arrive → Document → Guide) with an iris open from the point of light, a field-documentation viewfinder over the damage photos (focus lock, flash, captured thumbnails), step progress bars and synced copy; ends by pushing into the glowing tablet.
- **Workspace (centerpiece):** 3D cloud of items with camera orbit → items sort into Photos / Documents / Messages → compress into the rising screen → the real UI expands with layered depth frames, pointer tilt, camera moves across the screen and accurate hotspots per capability (hover / focus / tap).
- **Journey:** cinematic stage per step (scenes and real screens, labeled), flowing connector, node hover previews, animated mini claim-status demo, "Play the journey" auto-play, swipe + Prev/Next stepper on phones.
- **People:** pinned split-perspective — scroll moves the divider between the real-world scene and the workspace while a light beam links the tablet to the claim file; one beat per benefit.
- **Finale:** same house and hero framing; camera pulls back while the storm clears from the sky down, light warms, sun bloom and rays rise, rain fades; scroll-revealed headline and a haloed CTA.
- **Global:** chapter rail (desktop), long pins only at ≥1024px with stacked phone layouts, full reduced-motion fallbacks.

## V3 — the trailer cut (Higgsfield, 100-credit budget)

New footage, all built from the existing house and character images so the same house, homeowner and adjuster appear throughout:

| Asset | Model | Credits | Used in |
|---|---|---|---|
| 4 stills: adjuster arriving, on the ladder, tablet close-up, night office | GPT Image 2.6 (medium, 2K) | 4 | starting frames |
| `hero_trailer` 10 s storm push-in | Kling 3.0 std | 12.5 | Hero (seamless loop) |
| `docs_storm` paperwork in the wind | Kling 3.0 std | 6.25 | Chaos backdrop |
| `arrive_loop` adjuster walks up the driveway | Kling 3.0 std | 6.25 | Adjuster scene 1 |
| `ladder_loop` adjuster documents the roof | Kling 3.0 std | 6.25 | Adjuster scene 2, Journey "Inspect" |
| `turn_scrub` worry → relief (start/end frames) | Kling 3.0 std | 6.25 | Adjuster scene 3, scrubbed by scroll |
| `night_loop` organizing the claim at night | Kling 3.0 std | 6.25 | Workspace opening |
| `tablet_loop` homeowner points at the tablet | Kling 3.0 std | 6.25 | People, Journey "Progress" |
| `finale_scrub` 10 s storm → sunrise time-lapse (start/end frames) | Kling 3.0 std | 12.5 | Finale, scrubbed by scroll |
| Trailer score, 60 s instrumental | ElevenLabs Music v2 | 3.84 | Trailer |

About 70 of 100 credits used; one music attempt on v2.5 failed and was not charged.

- **Trailer:** `xactaclaim_trailer.mp4` — a 60 s letterboxed cut with title cards, real product screens and the score, opened from "Watch the trailer" (hero, nav, finale, phone bar). Sound plays only after the visitor presses play. Captions included. The end screen offers Start free / Explore XactaClaim.
- **Scroll-scrubbed video:** scrubbed clips are encoded with a keyframe every 4 frames so seeking stays smooth.
- **Conversion:** "Start free — 1 claim, no credit card" under the finale CTA, a trailer link in the nav, and a phone-only sticky "Start free · no credit card" bar. Claims match xactaclaim.com/pricing ("1 claim • 1 AI trial • No credit card").

## V4 — restored finale, narration, polish

- **Restored house:** new still of the same house fully restored (new roof, no tarp, gutter reattached, fresh landscaping) and a 10 s Kling time-lapse from the storm frame to it. It replaces the finale scrub video and the end of the trailer (GPT Image 2.6 high 2.75 + Kling 12.5 credits).
- **Voice-over:** 10 narration lines in the Higgsfield "Gideon" preset voice (Seed Audio, about 3 credits), trimmed, compressed and placed on the cut. The score ducks under the voice, and the mix is normalized to about -15 LUFS. Captions carry the narration.
- **Polish:** plans heading ("Start with one claim. Scale when you're ready."), cleaner finale headline, lighter warm grade, updated disclosures.

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
