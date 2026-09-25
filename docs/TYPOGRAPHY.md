# Typography — 2026-09-26

The user requested the original English typography again, with refined, slightly inclined Chinese across the site. This replaces the September 25 sans-serif/non-italic direction; content and interactions remain unchanged.

## English

Cormorant Garamond is restored from `@fontsource/cormorant-garamond` 5.3.0, the same package used in the original design (`4dbf0c5`). Latin weight 400 regular and actual italic are bundled with Vite, plus 600 regular for mixed-language section headings. Identity, navigation labels, bilingual supporting lines and ambient track titles use italic; clocks, metrics and contact addresses use regular for clear reading.

Source: https://github.com/google/fonts/tree/main/ofl/cormorantgaramond
License: `public/assets/fonts/Cormorant-Garamond-OFL.txt` (SIL Open Font License 1.1).

## Chinese

Portfolio Song is a renamed derivative of the OFL-licensed Noto Serif SC variable font, downloaded from the official Google Fonts repository on September 26, 2026:

- Source: https://github.com/google/fonts/tree/main/ofl/notoserifsc
- Original file: `NotoSerifSC[wght].ttf`
- License: `public/assets/fonts/Portfolio-Song-OFL.txt`
- Static weights: 450 regular and 600 semibold, exposed to their respective CSS weight ranges.
- Every glyph outline has a 4° rightward shear; advance widths remain unchanged. This makes the slight lean consistent without synthetic browser obliques or skewed containers/icons.
- The derivative family is renamed **Portfolio Song**; original copyright and license metadata are retained.
- Bundled WOFF2 subsets contain all Chinese characters currently present in `src/*.js` and `src/*.jsx`, plus ASCII and common punctuation. Each is approximately 183 KB.

Fonts are hosted with the site, with `font-display: swap` and system serif fallbacks. No external font service is needed at runtime. Existing legacy sans-serif files remain for historical asset continuity but are not used by the active typography rules.

## Maintenance

The final stylesheet is `src/typography.css`, imported after the original layout styles in `src/main.jsx`. It sets the Chinese/English pairing and adjusts line height, weight, tracking and responsive font sizes.

When adding new Chinese copy, regenerate the subset using the official source font and build-only Python dependencies:

```sh
python -m pip install 'fonttools[woff]'
python scripts/build-editorial-font.py /path/to/NotoSerifSC.ttf
```

The generator fails if source characters lack glyphs. It does not run during the normal site build; committed WOFF2 assets keep deployment independent of Python or a remote font download. Recheck narrow phones and short landscape views after content or font-size changes.
