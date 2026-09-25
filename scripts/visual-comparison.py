from PIL import Image, ImageDraw
from pathlib import Path
p=Path('docs/qa')
for label,ref,img,crop in [('home','01-home-night.png','desktop-night.png',(115,115,909,589)),('about','05-about.png','desktop-about.png',(174,173,1363,884)),('project','07-project-detail.png','desktop-project.png',(174,173,1363,884))]:
    a=Image.open('docs/reference/'+ref).convert('RGB').crop(crop).resize((960,576))
    b=Image.open(p/img).convert('RGB').resize((960,576))
    out=Image.new('RGB',(1920,612),'#e8e8e8');out.paste(a,(0,36));out.paste(b,(960,36))
    d=ImageDraw.Draw(out);d.text((20,12),'REFERENCE',fill='black');d.text((980,12),'IMPLEMENTATION',fill='black')
    out.save(p/(label+'-comparison.jpg'),quality=90)
    # Focused controls and typography comparison, excluding video subtitles.
    if label=='home':
        focus=Image.new('RGB',(960,300),'#e8e8e8')
        focus.paste(a.crop((0,190,280,380)).resize((480,300)),(0,0))
        focus.paste(b.crop((0,190,280,380)).resize((480,300)),(480,0))
        focus.save(p/'home-controls-comparison.jpg')
