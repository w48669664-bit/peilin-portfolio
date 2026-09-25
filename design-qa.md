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
