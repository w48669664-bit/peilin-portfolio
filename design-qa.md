# Design QA — Peilin Stillwater

Date: 2026-09-25

## Evidence and normalization

Source visual truth: `docs/reference/01-home-night.png`, `05-about.png`, `07-project-detail.png`, sampled from the supplied recording. Source video contains subtitles and a presenter overlay; these are excluded from product requirements, although they remain visible in the comparison evidence.

Implementation: Chrome at `http://127.0.0.1:4350/`, 1200 × 716 CSS pixels, DPR 1. Final browser captures: `docs/qa/desktop-night.png`, `desktop-about.png`, `desktop-project.png`. Source 01 is 1008 × 655, cropped to 794 × 474; source 05/07 are 1512 × 982, cropped to 1189 × 711. Both sides are normalized to 960 × 576 in combined comparisons. A small (<1%) aspect difference is ignored.

Combined comparison inputs opened and reviewed:
- `docs/qa/home-comparison.jpg`: full homepage, night state.
- `docs/qa/about-comparison.jpg`: centered biography overlay.
- `docs/qa/project-comparison.jpg`: project detail overlay.
- `docs/qa/home-controls-comparison.jpg`: focused navigation/type comparison.

Additional browser evidence: `mobile-home.png`, `mobile-project.png`, `mobile-resume.png`, `mobile-work.png`, `desktop-time.png`, `desktop-resume.png` in `docs/qa/`. Mobile tested at 390 × 844 and 320 × 740 CSS pixels. QA images and source recording frames stay local and are excluded from public Git history.

## Comparison history / fixes

1. [P2, fixed] Initial night reflection was too faint relative to the source's central silver light path. Strengthened specular highlights; the first adjustment was overly periodic. Replaced periodic highlight shapes with noise-driven, horizontally stretched facets. Final `desktop-night.png` / `home-comparison.jpg` show an irregular, visible reflection, retaining readable edge navigation.
2. [P2, fixed] Audio briefly displayed a false load error after development StrictMode cleanup. Removed stale error/pause handlers before releasing the old audio object. Fresh load is silent without an error; all three tracks were exercised with playback/pause and switching.
3. Capture issue, not product defect: the in-app browser's scaled screenshots clipped right/bottom content. Inspected DOM bounds and checked the same site in Chrome; standard browser captures show the whole viewport. Used CUA browser controls throughout. No production CSS compensation for a capture-tool scale was introduced.

## Five fidelity surfaces

- Typography: Cormorant Garamond provides the reference's serif signature/italic accents; Chinese uses system sans-serif. Chinese labels, 21px desktop navigation and readable detail copy intentionally replace the reference's smaller English labels. Focused comparison confirms hierarchy and no clipping.
- Spacing/layout: signature upper-left, navigation left-center, music right-center, small bottom caption. Biography retains the centered composition. Project details use a wider two-column desktop layout and mobile stack to satisfy the user's image-left/text-right requirement and detailed descriptions.
- Color/tokens: dark blue-green water, warm off-white text and restrained translucent overlays. Night reference is reproduced as a palette and lighting direction, not a pixel-identical water simulation. Resume uses a light reading surface intentionally.
- Images: original generated water texture plus rendered refraction; actual portrait, official marks from the previous site, and 18 real project screenshots. No source author's identity or video-player interface is included. Water stone arrangement is an intentional original-asset variation.
- Content: all six user projects, full internship narratives/metrics, shared courses, corrected award names and existing resume data. Project state/use limitations remain explicit; no invented eBay numerical lift is added.

## Functional checks

- All six project routes opened; third-slide state checked after each route settled. Three images per project and every referenced company logo/media file exist.
- Arrow/dot controls, keyboard ArrowRight, enlarged second image and Escape close checked.
- Time preset sets 23:00 / 18:40, range keyboard changes one minute, and return-to-now restores current time. Warm/cool lighting changes visibly.
- Music default silence, play/pause, next/previous and third-track playback checked. Old audio error no longer appears.
- Resume navigation reaches internship section; shared courses and all full experience content are present.
- Mobile resume/project scroll widths equal client widths at 320px and 390px; no horizontal overflow. Mobile screenshots reviewed for text and controls.
- No warning/error entries in Chrome console at final inspection.
- Production build passes; 4 Sites runtime tests pass; 18 project screenshot references verified.

## Residual test limits / polish

No actionable P0/P1/P2 findings remain. Physical-device touch gestures, OS reduced-motion changes during a visit, and real GPU context loss were not forced. Code includes touch swipe, a reduced-motion toggle/system initial preference, and static-background fallback. Reference has no audio track, so exact audio matching cannot be assessed; the site uses original synthesized ambient pieces. Three.js vendor chunk produces Vite's advisory size warning (about 129 KB gzip), with the application split separately.

Final result: passed


## Experience update — 2026-09-25

This update follows the user's later product feedback. The central introduction, additional personal sections and mechanical dial intentionally extend the reference recording.

### Implemented and checked

- Full name without punctuation; clear homepage purpose and manual featured-project switcher. About now uses a 172 × 224 desktop portrait / 120 × 158 mobile portrait and readable Chinese body text.
- Journey, working approach and contact pages verified. Journey's eBay link opens the full resume with its company section at 68 px from the viewport top. Copy email reports success.
- Water click and drag visibly create layered ripples and a continuous wake. Click sound unlocks Web Audio only after a gesture; trails cannot autoplay. Sound preference persists across reloads. Procedural audio lifecycle was checked with a mocked audio context, but physical speaker listening was not performed.
- Mechanical time wheel: keyboard increments and mouse wheel update the time; wheel interactions leave both document and overlay scroll at zero. Four light presets, input and return-to-now remain available.
- Music starts only by request; successive track switches reach Moonlit without an error. Opening either Time or About pauses music; closing the panel leaves it paused.
- Agent category shows exactly two projects. Project next-image works; lightbox Escape restores focus to its original enlarge button. Next-project navigation opens the correct title.
- Manual reduced motion applies the reduced class; global sound preference survives a full reload. System preference changes are handled in code; OS settings were not changed during QA.
- Fixed CSS import order so base rules precede the updated personal and time styles. Production build and four runtime tests passed. Console had no warning/error entries at final local inspection.

### Responsive evidence

Chrome browser checks at 1440 × 900, 390 × 844, 320 × 740 and 844 × 390. Home, About, Time and contact/reading layouts inspected. The 320 px resume and project views have no horizontal page overflow. Landscape time view has scroll height equal to viewport height (390 px).

Local evidence: `docs/qa/v2-home-desktop.png`, `v2-home-mobile.png`, `v2-about-mobile.png`, `v2-time-mobile.png`, `v2-time-landscape.png`, `v2-approach-mobile.png`. Evidence screenshots remain excluded from public source control.

### Remaining validation boundaries

Physical-device multi-touch, physical speaker listening, GPU context-loss forcing, slow-network emulation and platform-specific share-card scraping were not performed. These are not claimed as verified. Three.js retains its advisory 129 KB gzip vendor chunk warning.


### Live deployment verification

GitHub Pages deployment for implementation commit `4dbf0c5` completed successfully in Actions run `36124624469`. Verified the production homepage at https://w48669664-bit.github.io/peilin-stillwater/ in Chrome, opened 智帧华象 and changed to its Transformer screenshot. All 23 checked public resources returned HTTP 200: 18 project screenshots, the resume PDF, water texture and three ambient tracks; file content types were correct. The original portfolio repository remains clean and unchanged.


## Second review update — personal portfolio identity

User feedback supersedes the former center slogan and featured card. The homepage now keeps the personal-space label, names the purpose as a resume and portfolio, and provides separate online-resume/work links. The right header explicitly downloads the PDF. All public Stillwater branding and the old URL in active metadata are removed. The repository and Pages address are renamed to `peilin-portfolio`; the original resume site remains independent.

- Replaced the typography with locally hosted Noto Sans SC and Manrope WOFF2 subsets (~279 KB total), preserving OFL notices. Removed italic shorthands, unified numeric styles, and changed reading-panel titles to direct labels.
- Removed the featured-project component and its styling entirely.
- Water audio now uses three actual CC0 recordings (~65.6 KB total), with natural speed and pitch, sparse movement sound, position panning and sound-on-first-gesture logic. Detailed provenance and measured waveform/level information are in `docs/WATER_AUDIO.md`. A delayed-fetch simulation verified the first-click request waits for decoding rather than requiring a second click.
- Mechanical time feedback now layers paired contacts, short metallic detail and a low wheel-body transient; limited to one tick per 58 ms with reduced gain during rapid rotation. No initial-render/autoclock playback.
- Desktop 1440×900 and mobile 390×844 inspected. At 320×568 the home uses a scrollable grid; measured content height 717 px, scrollTop 149, no horizontal overflow, all footer controls reachable. Narrow navigation removes secondary English labels to avoid wrapping.
- Verified About's larger portrait and new typography visually. Time ArrowRight changed 18:51 to 18:56. Water clicking/dragging after reload produced no console errors or warnings. No subjective physical-speaker listening is claimed.
- Production build and all four runtime tests pass. Compiled font URLs resolve to the local assets/fonts directory under a relative Pages base.

Evidence: `docs/qa/v3-home-desktop.png` plus local visual inspections; earlier screenshots are historical versions.


New-address live check: implementation `15ad0c4` deployed successfully in Actions run `36126521658`. Confirmed https://w48669664-bit.github.io/peilin-portfolio/ renders the new homepage and project deep link. All 24 checked resources returned HTTP 200 with correct content types: 18 project screenshots, resume PDF, two WOFF2 fonts and three recorded water sounds. Visually checked the live portfolio-to-project route and second Transformer screenshot. The user preview now points to the new URL. Temporary browser viewport overrides were reset.


## Bilingual homepage and entrance motion — 2026-09-25

- Every central Chinese content group now has English beneath it: personal-space label, resume/portfolio heading, expertise, education, class-year focus and both actions. Education explicitly says Master’s Student; the class-year statement focuses on data science and AI Agent applications.
- The homepage uses paired type hierarchy, greater spacing between content groups and a staggered 760 ms fade/13 px rise/brief blur entrance. Delay steps are 90 ms; the final group starts at 360 ms. Panel entry uses a 360 ms opacity/5 px shift transition. No looping decorative animation was added.
- Verified reduced-motion mode through the actual control: heading parent computed animationName=none, opacity=1, visible=true. Restoring motion yields intro-arrive / 0.76s. Base elements remain visible when animation is disabled.
- Inspected 1440×900 desktop, 390×844 phone, 320×568 short phone and 844×390 landscape. Long bilingual copy uses scrollable layout on phones/short landscape. Measured no horizontal overflow: 309/309 px scroll/client width at 320, 833/833 at 844. Footer controls remain reachable.
- Opened the work panel from short-screen navigation and closed it; keyboard focus returned to the same link. First screenshot during entry visibly showed the staggered transition; the settled screenshot showed all six bilingual groups.
- Existing water audio and time-wheel behavior are unchanged in this update.
