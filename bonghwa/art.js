// 봉화대 사수 — pixel art: palette, sprite maps, item icons, battlefield painting and pixel primitives.
'use strict';

const PAL = {
  k: '#17131c', K: '#2b2530', w: '#f6f1e7', s: '#c9ced8', g: '#8b919e', G: '#5b6070',
  b: '#4f86ad', B: '#2f5677', r: '#cf4a35', R: '#8c2b22', o: '#ee8a2c', y: '#f3c94a', Y: '#b88a2a',
  n: '#8a5a34', N: '#563620', t: '#e0b083', T: '#b9845b', e: '#4fae5f', E: '#2c6e3c', q: '#b3d3a6',
  p: '#9a6ad8', P: '#5d3a8e', m: '#ee6aa6', c: '#a6e6ff', C: '#4fa8d8', v: '#d8d0c0', V: '#a39a89', x: '#6e665b',
  f: '#fff2a8', l: '#a8e66b', d: '#3a2f45', D: '#221b2b',
};

// Sprite maps: rows of palette letters, '.' is transparent. `alt` replaces the last rows for a second walking frame.
const SPR = {
  grunt: { rows: [
    '.....kk.....',
    '....kyyk....',
    '...kkbbkk...',
    '..kbbbbbbk..',
    '..kbwkbwkk..',
    '..kbwkkwbk.k',
    '...kbbbbk.kn',
    '..kbbbbbbkkn',
    '.kbkyyyykbnk',
    '.kkkyKyKkkk.',
    '...kyyyyk...',
    '...kbkkbk...',
    '...kbk.kbk..',
    '...kk...kk..'], alt: [
    '...kbkkbk...',
    '..kbk...kbk.',
    '..kk.....kk.'] },
  runner: { rows: [
    '..k....k..',
    '.kyk..kyk.',
    '..krrrrk..',
    '.krrrrrrk.',
    '.krwkrwkk.',
    '.krrkkrrk.',
    '..krrrrk..',
    '.krkyyykrk',
    '.kk.yyy.kk',
    '...kyyyk..',
    '..krk.krk.',
    '..kk...kk.'], alt: [
    '.krk...krk',
    '.kk.....kk'] },
  bandit: { rows: [
    '....kkkk....',
    '...kKKKKk...',
    '...krrrrk...',
    '...kttttk.k.',
    '...ktkktk.ks',
    '...kKKKKk.ks',
    '....kKKk..ks',
    '..knnnnnnkks',
    '.ktknnnnktks',
    '.kkkNNNNkkk.',
    '...knnnnk...',
    '...kNkkNk...',
    '...kN..Nk...',
    '...kk..kk...'], alt: [
    '...kNkkNk...',
    '..kN....Nk..',
    '..kk....kk..'] },
  guard: { rows: [
    '.....rr.....',
    '....krrk....',
    '...kggggk..s',
    '..kgssssgk.s',
    '..kgkGGkgk.n',
    '..kgGGGGgk.n',
    '...kggggk..n',
    '..kssssssk.n',
    '.ksgsgsgssnk',
    '.kgkssssgkn.',
    '..kGGGGGGkn.',
    '...kgkkgk...',
    '...kg..gk...',
    '...kk..kk...'], alt: [
    '...kgkkgk...',
    '..kg....gk..',
    '..kk....kk..'] },
  gangsi: { rows: [
    '...kkkkkk...',
    '..kKKKKKKk..',
    '...kkkkkk...',
    '...kqyyqk...',
    '...kqRRqk...',
    '...kkqqkk...',
    '.kqkBBBBkqk.',
    '.kqBBBBBBqk.',
    '..kByyyyBk..',
    '...kBBBBk...',
    '...kBBBBk...',
    '...kBkkBk...',
    '...kq..qk...',
    '...kk..kk...'] },
  hareubang: { rows: [
    '....kkkk....',
    '...kxxxxk...',
    '..kxVVVVxk..',
    '.kkkkkkkkkk.',
    '..kVVVVVVk..',
    '..kVwkkwVk..',
    '..kVwkkwVk..',
    '..kVVkkVVk..',
    '..kVVVVVVk..',
    '..kVkkkkVk..',
    '.kVVVVVVVVk.',
    '.kVkkVVkkVk.',
    '.kVVVVVVVVk.',
    '.kVVVVVVVVk.',
    '..kxxxxxxk..',
    '..kkkkkkkk..'] },
  giant: { rows: [
    '.....kkkkkk.....',
    '....kVVVVVVk....',
    '...kVvVVVVvVk...',
    '...kVkyVVykVk...',
    '...kVVVVVVVVk...',
    '.kkkxVVVVVVxkkk.',
    'kVVkxxVVVVxxkVVk',
    'kVvkVVVVVVVVkvVk',
    'kVVkVVxVVxVVkVVk',
    '.kkkVVVVVVVVkkk.',
    '...kVVVVVVVVk...',
    '...kxxVVVVxxk...',
    '...kVVk..kVVk...',
    '...kVVk..kVVk...',
    '..kxxxk..kxxxk..',
    '..kkkkk..kkkkk..'] },
  wolf: { rows: [
    '.kk...........',
    'kgGk..........',
    'kgggkkkkkkk...',
    'kwkgggggggGkk.',
    '.kgggggggggGGk',
    '..kggggggggGk.',
    '..kGkkkkkGkk..',
    '..kgk...kgk...',
    '..kgk...kgk...',
    '..kk....kk....'], alt: [
    '.kgk.....kgk..',
    '.kk......kk...'] },
  wisp: { rows: [
    '...k....',
    '..kck...',
    '..kCck..',
    '.kcCCck.',
    '.kCwwCk.',
    'kcCwkwCk',
    'kcCwwwCk',
    '.kcCCck.',
    '..kkkk..'], alt: [
    '.kcCCck.',
    '..kkkk..'] },
  treasure: { rows: [
    '.....kk.......',
    '....kyyk.kkk..',
    '...kkeekkYYYk.',
    '..keeeeeekyYYk',
    '..kewkewkkYyYk',
    '..kewkkwekYYYk',
    '...keeeek.kkk.',
    '..keeeeeek....',
    '.kekyyyykek...',
    '.kkkyKyKkkk...',
    '...kyyyyk.....',
    '...kekkek.....',
    '...kek.kek....',
    '...kk...kk....'], alt: [
    '...kekkek.....',
    '..kek...kek...',
    '..kk.....kk...'] },
  bulga: { rows: [
    '......k.k.k.k.......',
    '.....kskskskskk.....',
    '....kggggggggggk....',
    '..kkgggggggggggGk...',
    '.kgggggggggggggGGk..',
    'kgykggggggggggggGGk.',
    'kggggggggggggggGGGk.',
    'kgkkgggggggggggGGk..',
    'kgk.kGGGGGGGGGGGk...',
    'kgk.kgk.kgk.kgk.....',
    '.kk.kgk.kgk.kgk.....',
    '....kGk.kGk.kGk.....',
    '....kkk.kkk.kkk.....'] },
  gumiho: { rows: [
    '..........kk..kk..kk',
    '.........kwmkkwmkkwk',
    '.k.k.....kwwkwwkwwk.',
    'kwkwk.....kwwwwwwk..',
    'kwwwwk.....kwwwwk...',
    'kwrwwwkkkkkkwwwk....',
    '.kwwwwwwwwwwwwk.....',
    '..kwwwwwwwwwwwk.....',
    '..kwwkkkkkkwwk......',
    '..kwk.....kwk.......',
    '..kwk.....kwk.......',
    '..kk......kk........'] },
  dragon: { rows: [
    '..kk..................kk..',
    '.kRRk.....kkkkkk.....kRRk.',
    '.kRdRk...kddddddk...kRdRk.',
    '..kddk..kddddddddk..kddk..',
    '...kddkkddrddddrddkkddk...',
    '...kdddddddddddddddddk....',
    '..kPdddkddddddddddkdddPk..',
    '.kPPPdk.kddwddwddk.kdPPPk.',
    'kPPPPk...kddddddk...kPPPPk',
    'kPPPk....kdyyyydk....kPPPk',
    'kPPk.....kddddddk.....kPPk',
    '.kk.....kdddddddk......kk.',
    '.......kdddkkdddk.........',
    '......kdddk..kdddk........',
    '......kddk....kddk........',
    '......kkk......kkk........'] },
};
// Bosses that reuse a smaller map with their own colors.
const SPR_ALIAS = {
  chief: { base: 'grunt', pal: { b: '#c8503a', B: '#8c2b22', y: '#f3d36a' } },
};
const SPR_SCALE = { chief: 2, bulga: 2, gumiho: 2, dragon: 2 };

// 12×12 item icons. 'a' is replaced by the item's type colour, 'z' by its element colour.
const ICONS = {
  knife: [
    '............', '.........kk.', '........ksk.', '.......ksk..', '......ksk...', '.....ksk....',
    '..k.ksk.....', '...kNk......', '...kNNk.....', '..kNk.k.....', '.kNk........', '..k.........'],
  saber: [
    '..........k.', '.........ksk', '........ksk.', '.......ksk..', '......ksk...', '.....ksk....',
    '....ksk.....', '..kkyk......', '...kyk......', '..kNkk......', '.kNk........', '.kk.........'],
  sword: [
    '..........kk', '.........kwk', '........kwsk', '.......kwsk.', '......kwsk..', '.....kwsk...',
    '..kkkkwsk...', '...kykk.....', '...kyyk.....', '..kNk.k.....', '.kNk........', '.kk.........'],
  star: [
    '.....kk.....', '....kyyk....', 'kkkkkyykkkkk', 'kyyyyyyyyyyk', '.kyyyyyyyyk.', '..kyyyyyyk..',
    '..kyyyyyyk..', '.kyyykkyyyk.', '.kyyk..kyyk.', 'kyyk....kyyk', 'kkk......kkk', '............'],
  bow: [
    '...kkk......', '..knnnk.....', '..kn.kwk....', '.kn...kwk...', '.kn....kwk..', 'kn......kwk.',
    'kn......kwk.', '.kn....kwk..', '.kn...kwk...', '..kn.kwk....', '..knnnk.....', '...kkk......'],
  arrow: [
    '..........kk', '.........ksk', '........ksk.', '.......kNk..', '......kNk...', '.....kNk....',
    '....kNk.....', '...kNk......', '.kkNk.......', 'krkk........', '.krk........', '..k.........'],
  charm: [
    '..kkkkkkkk..', '..kyyyyyyk..', '..kyRRRRyk..', '..kyyRyyyk..', '..kyRRRRyk..', '..kyyyyRyk..',
    '..kyRRRRyk..', '..kyyRyyyk..', '..kyRRRyyk..', '..kyyyyyyk..', '..kkkkkkkk..', '............'],
  charm5: [
    'kkkkk..kkkkk', 'kyRyk..kyRyk', 'kyyyk..kyyyk', 'kyRyk..kyRyk', 'kkkkkkkkkkk.', '...kyRyk....',
    '...kyyyk....', '...kyRyk....', '...kkkkk....', '............', '............', '............'],
  skull: [
    '...kkkkkk...', '..kwwwwwwk..', '.kwwwwwwwwk.', '.kwkkwwkkwk.', '.kwkkwwkkwk.', '.kwwwkkwwwk.',
    '..kwwwwwwk..', '...kwkwkk...', '...kkkkk....', '............', '............', '............'],
  yinyang: [
    '...kkkkkk...', '..krrrrrrk..', '.krrrrrrrrk.', 'krrrkrrrrrrk', 'krrrrrrrrrrk', 'krrrrrrBBBBk',
    'kBBBBrrrrBBk', 'kBBBBBBkBBBk', 'kBBBBBBBBBBk', '.kBBBBBBBBk.', '..kBBBBBBk..', '...kkkkkk...'],
  bomb: [
    '.......k.y..', '......kNky..', '.....kNk....', '...kkkkkk...', '..kGGGGGGk..', '.kGGsGGGGGk.',
    '.kGsGGGGGGk.', '.kGGGGGGGGk.', '.kGGGGGGGGk.', '..kGGGGGGk..', '...kkkkkk...', '............'],
  cannon: [
    '............', '..........k.', '......kkkkok', '....kkYYYYk.', '..kkYYYYYYk.', '.kYYYYYYkk..',
    'kYYYYYYk....', 'kkYYkkk.....', '.kNNNNNk....', 'kNkNNNkNk...', 'kkk.kk.kk...', '............'],
  hwacha: [
    '.......k.k.k', '......kokoko', '.....kNkNkNk', '....kNNNNNNk', '...kNNkNNkNk', '..kNNNNNNNk.',
    '.kNNkNNkNk..', '.kNNNNNNk...', 'kNNNNNNk....', 'kkkNNkkk....', '.kk..kk.....', '............'],
  wisp: [
    '.....k......', '....kck.....', '....kcCk....', '...kcCck....', '..kcCCCck...', '.kcCwwCCck..',
    '.kcwwwwCck..', '.kCwwwwCck..', '.kcCwwCck...', '..kcCCck....', '...kkkk.....', '............'],
  club: [
    '.......kkkk.', '......kNNNNk', '.....kNyNNyk', '....kNNNNNNk', '...kNNyNNyNk', '..kNNNNNNkk.',
    '.kNNNNNkk...', 'kNNNkkk.....', 'knnk........', 'knk.........', 'kk..........', '............'],
  mask: [
    '..kkkkkkkk..', '.krrrrrrrrk.', 'krrrrrrrrrrk', 'krkkrrrrkkrk', 'krkwrrrrwkrk', 'krrrrrrrrrrk',
    'krrrrkkrrrrk', '.krrkwwkrrk.', '.krrrkkrrrk.', '..krrrrrrk..', '...kkkkkk...', '............'],
  mirror: [
    '...kkkkkk...', '..kYYYYYYk..', '.kYccccccYk.', '.kYcwwccccYk', '.kYcwccccYk.', '.kYccccccYk.',
    '.kYccccccYk.', '..kYYYYYYk..', '....kYYk....', '....kYYk....', '...kYYYYk...', '...kkkkkk...'],
  pearl: [
    '....kkkk....', '...kmmmmk...', '..kmwwmmmk..', '.kmwwmmmmmk.', '.kmwmmmmmmk.', '.kmmmmmmmmk.',
    '.kmmmmmmPmk.', '..kmmmmPPk..', '...kmPPPk...', '....kkkk....', '...kyyyyk...', '..kkkkkkkk..'],
  up: [
    '.....kk.....', '....kaak....', '...kaaaak...', '..kaaaaaak..', '.kaaaaaaaak.', 'kkkkaaaakkkk',
    '...kaaaak...', '...kaaaak...', '...kaaaak...', '...kaaaak...', '...kkkkkk...', '............'],
  feather: [
    '.........kk.', '........kwk.', '.......kwwk.', '......kwwsk.', '.....kwwsk..', '....kwwsk...',
    '...kwwsk....', '..kwwsk.....', '..kwsk......', '.kkkk.......', 'kk..........', '............'],
  eye: [
    '............', '............', '...kkkkkk...', '..kwwwwwwk..', '.kwwkkkkwwk.', 'kwwkCCCCkwwk',
    'kwwkCkkCkwwk', '.kwwkkkkwwk.', '..kwwwwwwk..', '...kkkkkk...', '............', '............'],
  target: [
    '...kkkkkk...', '..krrrrrrk..', '.krwwwwwwrk.', 'krwrrrrrrwrk', 'krwrwwwwrwrk', 'krwrwrrwrwrk',
    'krwrwrrwrwrk', 'krwrwwwwrwrk', 'krwrrrrrrwrk', '.krwwwwwwrk.', '..krrrrrrk..', '...kkkkkk...'],
  flame: [
    '.....k......', '....kok.....', '....kook....', '...kooyk....', '..kooyyok...', '..koyyfyok..',
    '.kooyffyok..', '.koyyffyyok.', '.koyffffyok.', '..kooyyook..', '...kkkkkk...', '............'],
  snow: [
    '.....kk.....', '..k..cc..k..', '...k.cc.k...', '....kcck....', 'kccccwwcccck', 'kccccwwcccck',
    '....kcck....', '...k.cc.k...', '..k..cc..k..', '.....kk.....', '............', '............'],
  drop: [
    '.....k......', '....klk.....', '....klk.....', '...klllk....', '...klllk....', '..kllwllk...',
    '..klwlllk...', '.klllllllk..', '.klllllllk..', '..klllllk...', '...kkkkk....', '............'],
  bolt: [
    '.......kkk..', '......kyyk..', '.....kyyk...', '....kyyk....', '...kyyykkk..', '..kyyyyyyk..',
    '..kkkkyyk...', '.....kyk....', '....kyk.....', '...kyk......', '...kk.......', '............'],
  coin: [
    '...kkkkkk...', '..kyyyyyyk..', '.kyyYYYYyyk.', 'kyyYkkkkYyyk', 'kyyYk..kYyyk', 'kyyYk..kYyyk',
    'kyyYkkkkYyyk', 'kyyYYYYYYyyk', '.kyyyyyyyyk.', '..kyyyyyyk..', '...kkkkkk...', '............'],
  sack: [
    '....kkkk....', '.....kk.....', '....kYYk....', '...kYnnYk...', '..knnnnnnk..', '.knnnyynnnk.',
    '.knnyYYynnk.', '.knnnyynnnk.', '.knnnnnnnnk.', '..knnnnnnk..', '...kkkkkk...', '............'],
  heart: [
    '............', '.kkk...kkk..', 'krrrk.krrrk.', 'krwrrkrrrrk.', 'krrrrrrrrrk.', 'krrrrrrrrrk.',
    '.krrrrrrrk..', '..krrrrrk...', '...krrrk....', '....krk.....', '.....k......', '............'],
  potion: [
    '....kkkk....', '....kNNk....', '....kwwk....', '...kwwwwk...', '..kwCCCCwk..', '.kwCCcCCCwk.',
    '.kwCcCCCCwk.', '.kwCCCCCCwk.', '.kwCCCCCCwk.', '..kwwwwwwk..', '...kkkkkk...', '............'],
  shield: [
    '.kkkkkkkkkk.', '.kssssssssk.', '.ksBBBBBBsk.', '.ksBByyBBsk.', '.ksByyyyBsk.', '.ksBByyBBsk.',
    '.ksBBBBBBsk.', '..ksBBBBsk..', '...ksBBsk...', '....kssk....', '.....kk.....', '............'],
  wall: [
    '............', 'kkkk.kkkk.kk', 'kVVk.kVVk.kV', 'kkkkkkkkkkkk', 'kVVVkVVVVkVk', 'kVVVkVVVVkVk',
    'kkkkkkkkkkkk', 'kVkVVVVkVVVk', 'kVkVVVVkVVVk', 'kkkkkkkkkkkk', 'kVVVkVVVVkVk', 'kkkkkkkkkkkk'],
  thorn: [
    '.....k......', '....kGk.....', '..k.kGk.k...', '..kkkGkkk...', '...kGGGk....', 'k..kGGGk..k.',
    'kkkGGGGGkkk.', '..kGGGGGk...', '.kGGGGGGGk..', 'kGGGkkkGGGk.', 'kkk.....kkk.', '............'],
};

// 3×5 digits for floating damage numbers.
const DIGITS = {
  '0': ['111', '101', '101', '101', '111'], '1': ['010', '110', '010', '010', '111'], '2': ['111', '001', '111', '100', '111'],
  '3': ['111', '001', '111', '001', '111'], '4': ['101', '101', '111', '001', '001'], '5': ['111', '100', '111', '001', '111'],
  '6': ['111', '100', '111', '101', '111'], '7': ['111', '001', '010', '010', '010'], '8': ['111', '101', '111', '101', '111'],
  '9': ['111', '101', '111', '001', '111'], '+': ['000', '010', '111', '010', '000'], 'k': ['100', '101', '110', '101', '101'],
  'm': ['000', '111', '111', '101', '101'], '.': ['000', '000', '000', '000', '010'], '!': ['010', '010', '010', '000', '010'],
};

// ───────── sprite baking ─────────
function bakeMap(rows, pal, scale = 1) {
  const h = rows.length, w = Math.max(...rows.map(r => r.length));
  const cv = document.createElement('canvas'); cv.width = w * scale; cv.height = h * scale;
  const g = cv.getContext('2d');
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const ch = rows[y][x]; if (!ch || ch === '.') continue;
    const col = pal[ch] || PAL[ch]; if (!col) continue;
    g.fillStyle = col; g.fillRect(x * scale, y * scale, scale, scale);
  }
  return cv;
}
function silhouette(src, color) {
  const cv = document.createElement('canvas'); cv.width = src.width; cv.height = src.height;
  const g = cv.getContext('2d'); g.drawImage(src, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = color; g.fillRect(0, 0, cv.width, cv.height);
  return cv;
}
function flipped(src) {
  const cv = document.createElement('canvas'); cv.width = src.width; cv.height = src.height;
  const g = cv.getContext('2d'); g.translate(src.width, 0); g.scale(-1, 1); g.drawImage(src, 0, 0); return cv;
}
const SPRITES = {};
function bakeSprites() {
  const make = (key, def, pal = {}, scale = 1) => {
    const rows = def.rows, frames = [rows];
    if (def.alt) frames.push(rows.slice(0, rows.length - def.alt.length).concat(def.alt));
    const imgs = frames.map(f => bakeMap(f, pal, scale));
    SPRITES[key] = {
      w: imgs[0].width, h: imgs[0].height, frames: imgs, flip: imgs.map(flipped),
      white: imgs.map(i => silhouette(i, '#ffffff')), whiteFlip: imgs.map(i => silhouette(flipped(i), '#ffffff')),
      ice: silhouette(imgs[0], '#bfeaff'),
    };
  };
  for (const k in SPR) make(k, SPR[k], {}, SPR_SCALE[k] || 1);
  for (const k in SPR_ALIAS) make(k, SPR[SPR_ALIAS[k].base], SPR_ALIAS[k].pal, SPR_SCALE[k] || 1);
}
const ICON_URL = {};
function iconUrl(name, typeColor = '#e6e6e6', elemColor = '#ffffff') {
  const key = name + typeColor + elemColor;
  if (ICON_URL[key]) return ICON_URL[key];
  const rows = ICONS[name] || ICONS.up;
  ICON_URL[key] = bakeMap(rows, { a: typeColor, z: elemColor }, 1).toDataURL();
  return ICON_URL[key];
}

// ───────── pixel primitives (integer coordinates on the 400×360 field) ─────────
function pr(g, x, y, w, h, c) { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); }
function pcirc(g, cx, cy, r, c) {
  cx = Math.round(cx); cy = Math.round(cy); r = Math.max(0, Math.round(r)); g.fillStyle = c;
  for (let dy = -r; dy <= r; dy++) { const dx = Math.floor(Math.sqrt(r * r - dy * dy)); g.fillRect(cx - dx, cy + dy, dx * 2 + 1, 1); }
}
function pring(g, cx, cy, r, c) {
  cx = Math.round(cx); cy = Math.round(cy); r = Math.round(r); g.fillStyle = c;
  let x = r, y = 0, err = 1 - r;
  while (x >= y) {
    for (const [a, b] of [[x, y], [y, x], [-y, x], [-x, y], [-x, -y], [-y, -x], [y, -x], [x, -y]]) g.fillRect(cx + a, cy + b, 1, 1);
    y++; if (err < 0) err += 2 * y + 1; else { x--; err += 2 * (y - x) + 1; }
  }
}
function pline(g, x0, y0, x1, y1, c) {
  x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1); g.fillStyle = c;
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1; let err = dx + dy, n = 0;
  while (n++ < 800) { g.fillRect(x0, y0, 1, 1); if (x0 === x1 && y0 === y1) break; const e2 = 2 * err; if (e2 >= dy) { err += dy; x0 += sx; } if (e2 <= dx) { err += dx; y0 += sy; } }
}
function pdigits(g, str, x, y, c, scale = 1) {
  const w = str.length * 4 * scale - scale; let cx = Math.round(x - w / 2); y = Math.round(y);
  for (const ch of str) {
    const d = DIGITS[ch]; if (d) {
      g.fillStyle = '#17131c';
      for (let r = 0; r < 5; r++) for (let q = 0; q < 3; q++) if (d[r][q] === '1') g.fillRect(cx + q * scale - 1, y + r * scale - 1, scale + 2, scale + 2);
      g.fillStyle = c;
      for (let r = 0; r < 5; r++) for (let q = 0; q < 3; q++) if (d[r][q] === '1') g.fillRect(cx + q * scale, y + r * scale, scale, scale);
    }
    cx += 4 * scale;
  }
}
function shortNum(n) { n = Math.round(n); if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace('.0', '') + 'm'; if (n >= 1e4) return Math.round(n / 1e3) + 'k'; return String(n); }

// ───────── battlefield ─────────
const FW = 400, FH = 360, CX = 200, CY = 184, PLAZA_R = 62;
const THEMES = {
  field:  { grass: ['#3f6b35', '#4a7a3c', '#365d2e', '#55873f'], flower: ['#f0d36a', '#e98fb8', '#f4f1e7'], path: ['#7d6a4a', '#8a7552', '#6f5d40'], stone: ['#7d8290', '#8a8f9c', '#6c717e'], rim: '#4c505c', tree: ['#2d5a30', '#3c7040', '#244a28'], trunk: '#5a3d26', fog: null },
  autumn: { grass: ['#7a6a33', '#8a7838', '#6a5b2c', '#94803d'], flower: ['#e0672f', '#f0b24a', '#c94a2c'], path: ['#7a5f42', '#86694a', '#6b523a'], stone: ['#857b70', '#928777', '#746a60'], rim: '#4f463e', tree: ['#b5532c', '#d27a33', '#8e3b22'], trunk: '#4e3420', fog: null },
  night:  { grass: ['#2c2740', '#332d4a', '#262236', '#3a3352'], flower: ['#8a5ad8', '#5ab0d8', '#c84a6a'], path: ['#4a3f55', '#54485f', '#40364a'], stone: ['#5a5868', '#666474', '#4e4c5c'], rim: '#2e2c38', tree: ['#3a2f4a', '#4a3a5c', '#2c2238'], trunk: '#2a2030', fog: 'rgba(90,60,130,0.10)' },
};
function paintField(theme) {
  const T = THEMES[theme], cv = document.createElement('canvas'); cv.width = FW; cv.height = FH;
  const g = cv.getContext('2d'), rnd = mulberry32(theme.length * 9173 + 41);
  g.fillStyle = T.grass[0]; g.fillRect(0, 0, FW, FH);
  for (let i = 0; i < 5200; i++) pr(g, rnd() * FW, rnd() * FH, 1, 1, T.grass[1 + ((rnd() * 3) | 0)]);
  // four dirt roads into the plaza
  const road = (x, y, w, h) => { for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) if (rnd() < 0.92) pr(g, xx, yy, 1, 1, T.path[(rnd() * 3) | 0]); };
  road(CX - 13, 0, 26, CY); road(CX - 13, CY, 26, FH - CY); road(0, CY - 13, CX, 26); road(CX, CY - 13, FW - CX, 26);
  for (let i = 0; i < 260; i++) { const a = rnd() * Math.PI * 2, d = 80 + rnd() * 180; const x = CX + Math.cos(a) * d, y = CY + Math.sin(a) * d * 0.95; pr(g, x, y, 1, 1, T.flower[(rnd() * 3) | 0]); }
  for (let i = 0; i < 160; i++) { const x = rnd() * FW, y = rnd() * FH; if (Math.hypot(x - CX, y - CY) < PLAZA_R + 8) continue; pr(g, x, y, 1, 2, T.grass[3]); pr(g, x + 1, y + 1, 1, 1, T.grass[3]); pr(g, x - 1, y + 1, 1, 1, T.grass[3]); }
  // stone plaza
  pcirc(g, CX, CY, PLAZA_R + 3, T.rim); pcirc(g, CX, CY, PLAZA_R, T.stone[0]);
  for (let y = CY - PLAZA_R; y <= CY + PLAZA_R; y++) for (let x = CX - PLAZA_R; x <= CX + PLAZA_R; x++) {
    if (Math.hypot(x - CX, y - CY) > PLAZA_R - 1) continue;
    const gx = (x - CX + 200) % 12, gy = (y - CY + 200) % 10;
    if (gx === 0 || gy === 0) pr(g, x, y, 1, 1, T.stone[2]); else if (rnd() < 0.08) pr(g, x, y, 1, 1, T.stone[1]);
  }
  pring(g, CX, CY, PLAZA_R + 1, T.stone[2]);
  // trees around the edge, keeping the roads clear
  const trees = [];
  for (let i = 0; i < 400 && trees.length < 46; i++) {
    const x = 6 + rnd() * (FW - 12), y = 8 + rnd() * (FH - 10);
    const edge = Math.min(x, FW - x, y, FH - y);
    if (edge > 54 || Math.abs(x - CX) < 24 || Math.abs(y - CY) < 24) continue;
    if (trees.some(t => Math.hypot(t.x - x, t.y - y) < 16)) continue;
    trees.push({ x, y });
  }
  trees.sort((a, b) => a.y - b.y);
  for (const t of trees) drawTree(g, t.x, t.y, T, rnd, theme === 'night');
  if (T.fog) { g.fillStyle = T.fog; g.fillRect(0, 0, FW, FH); }
  return cv;
}
function drawTree(g, x, y, T, rnd, dead) {
  x = Math.round(x); y = Math.round(y);
  pr(g, x - 6, y + 4, 13, 3, 'rgba(0,0,0,0.25)');
  pr(g, x - 1, y - 2, 3, 7, PAL.k); pr(g, x, y - 2, 1, 6, T.trunk);
  if (dead) { pline(g, x, y - 2, x - 5, y - 10, T.trunk); pline(g, x, y - 4, x + 5, y - 11, T.trunk); pline(g, x - 3, y - 7, x - 7, y - 8, T.trunk); return; }
  pcirc(g, x, y - 9, 8, PAL.k); pcirc(g, x, y - 9, 7, T.tree[0]); pcirc(g, x - 2, y - 11, 4, T.tree[1]);
  for (let i = 0; i < 6; i++) pr(g, x - 5 + rnd() * 10, y - 14 + rnd() * 9, 1, 1, T.tree[2]);
}
// The beacon tower: stone base, wooden lookout and a fire basket, drawn at the field centre.
function drawTower(g, t, hpRatio, theme) {
  const x = CX, base = CY + 10;
  pr(g, x - 20, base - 2, 41, 6, 'rgba(0,0,0,0.3)');
  // stone base
  for (let i = 0; i < 26; i++) { const w = 30 - Math.floor(i / 4); pr(g, x - (w >> 1) - 1, base - i - 1, w + 2, 1, PAL.k); pr(g, x - (w >> 1), base - i - 1, w, 1, i % 6 === 5 ? '#6c665c' : '#8f887b'); }
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) pr(g, x - 13 + c * 7 + (r % 2) * 3, base - 4 - r * 6, 1, 4, '#6c665c');
  pr(g, x - 4, base - 10, 8, 10, PAL.k); pr(g, x - 3, base - 9, 6, 9, '#4a3020'); pr(g, x - 3, base - 9, 6, 1, '#6a4a30');
  // wooden lookout
  pr(g, x - 13, base - 29, 26, 4, PAL.k); pr(g, x - 12, base - 28, 24, 2, '#8a5a34');
  for (const px of [-11, -4, 3, 10]) { pr(g, x + px, base - 40, 2, 12, PAL.k); pr(g, x + px, base - 39, 1, 10, '#a06a3c'); }
  pr(g, x - 13, base - 42, 26, 3, PAL.k); pr(g, x - 12, base - 41, 24, 1, '#8a5a34');
  // fire basket
  pr(g, x - 6, base - 47, 12, 6, PAL.k); pr(g, x - 5, base - 46, 10, 4, '#3a3a44');
  const lit = hpRatio > 0;
  if (lit) {
    const f = Math.floor(t * 10) % 3, hgt = 7 + f + Math.round(hpRatio * 3);
    for (let i = 0; i < hgt; i++) { const w = Math.max(1, 8 - Math.floor(i * 8 / hgt) + ((i + f) % 2)); pr(g, x - (w >> 1), base - 48 - i, w, 1, i < hgt * 0.35 ? '#ee8a2c' : i < hgt * 0.7 ? '#f3c94a' : '#fff2a8'); }
    for (let i = 0; i < 3; i++) { const p = (t * 0.8 + i / 3) % 1; pr(g, x - 3 + i * 3 + Math.sin(t * 3 + i) * 2, base - 52 - p * 20, 1, 1, p < 0.5 ? '#f3c94a' : '#8b919e'); }
  }
  // banner
  pr(g, x + 14, base - 58, 1, 30, PAL.k);
  const wave = Math.floor(t * 4) % 2;
  pr(g, x + 15, base - 58, 8, 6 + wave, '#cf4a35'); pr(g, x + 15, base - 58, 8, 1, '#8c2b22');
  if (theme === 'night') pr(g, x - 16, base - 50, 32, 50, 'rgba(255,200,120,0.03)');
}
function drawTorch(g, x, y, t) {
  pr(g, x, y - 6, 2, 7, PAL.k); pr(g, x, y - 5, 1, 5, '#6a4a30');
  const f = Math.floor(t * 8 + x) % 2;
  pr(g, x - 1, y - 9 - f, 4, 3 + f, '#ee8a2c'); pr(g, x, y - 10 - f, 2, 2, '#fff2a8');
}
const TORCHES = [[CX - 44, CY - 42], [CX + 43, CY - 42], [CX - 44, CY + 46], [CX + 43, CY + 46]];

function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
