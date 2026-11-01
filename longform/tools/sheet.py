# 사용: python3 -I longform/tools/sheet.py <jpg 폴더> [한 장에 담을 수=6]  → 폴더 안에 sheet0.png … (3열 모음). 레이아웃 겹침·잘림을 한 번에 본다.
import sys,glob,os
from PIL import Image
d=sys.argv[1]; per=int(sys.argv[2]) if len(sys.argv)>2 else 6
fs=sorted(glob.glob(d+'/*.jpg'))
sc=0.4;tw,th=int(1920*sc),int(1080*sc)
for si in range(0,len(fs),per):
    chunk=fs[si:si+per]; cols=3; rows=(len(chunk)+cols-1)//cols
    sh=Image.new('RGB',(tw*cols,th*rows),'black')
    for j,f in enumerate(chunk):
        im=Image.open(f).resize((tw,th)); sh.paste(im,((j%cols)*tw,(j//cols)*th))
    sh.save(f'{d}/sheet{si//per}.png')
    print(f'sheet{si//per}',[os.path.basename(x) for x in chunk])
