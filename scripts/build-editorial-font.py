"""Subset the OFL Noto Serif SC source and give Chinese glyphs a subtle 4° lean.

Usage: python scripts/build-editorial-font.py /path/to/NotoSerifSC.ttf
Build-time only; requires fonttools[woff]. Source/license: docs/TYPOGRAPHY.md.
"""
import math
import sys
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.ttGlyphPen import TTGlyphPen

root = Path(__file__).resolve().parents[1]
text = ''.join(p.read_text() for p in (root / 'src').glob('*') if p.suffix in {'.jsx', '.js'})
characters = {c for c in text if ord(c) >= 0x3000}
characters.update(chr(c) for c in range(0x20, 0x7f))
characters.update('，。；：？！、（）【】《》「」·—–…％＋－℃→')
source = TTFont(sys.argv[1])
options = subset.Options()
options.layout_features = ['*']
options.notdef_outline = True
subsetter = subset.Subsetter(options=options)
subsetter.populate(text=''.join(sorted(characters)))
subsetter.subset(source)
shear = math.tan(math.radians(4))
for weight, style in [(450, 'Regular'), (600, 'Semibold')]:
    font = instantiateVariableFont(source, {'wght': weight}, inplace=False)
    glyphs = font.getGlyphSet()
    transformed = {}
    for name in font.getGlyphOrder():
        recording = DecomposingRecordingPen(glyphs)
        glyphs[name].draw(recording)
        pen = TTGlyphPen(None)
        recording.replay(TransformPen(pen, (1, 0, shear, 1, 0, 0)))
        transformed[name] = pen.glyph()
    for name, glyph in transformed.items():
        font['glyf'][name] = glyph
        glyph.recalcBounds(font['glyf'])
        advance, old_lsb = font['hmtx'][name]
        font['hmtx'][name] = advance, getattr(glyph, 'xMin', old_lsb)
    # This modified derivative uses a new name and preserves source copyright/OFL.
    names = {1: 'Portfolio Song', 2: style, 3: f'PortfolioSong-{style}-20260926',
             4: f'Portfolio Song {style}', 6: f'PortfolioSong-{style}',
             16: 'Portfolio Song', 17: style}
    for record in font['name'].names:
        if record.nameID in names:
            record.string = names[record.nameID].encode(record.getEncoding())
    font['post'].italicAngle = -4
    font.flavor = 'woff2'
    output = root / 'public/assets/fonts' / f'portfolio-song-{weight}.woff2'
    font.save(output)
    missing = sorted(ord(c) for c in characters if ord(c) not in font.getBestCmap())
    if missing:
        raise ValueError(f'Missing glyphs: {missing}')
    print(f'{output.name}: {output.stat().st_size:,} bytes; {len(characters)} characters; 4° lean')
