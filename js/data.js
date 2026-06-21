// ══════════════════════════════════════════════════════════════════
//  DATA — hiragana groups and the curated word list for Typing mode.
//  No logic here, just the source data other modules read from.
// ══════════════════════════════════════════════════════════════════

const GROUPS = [
  { name: 'Vowels', kana: [{r:'a',h:'あ'},{r:'i',h:'い'},{r:'u',h:'う'},{r:'e',h:'え'},{r:'o',h:'お'}] },
  { name: 'K-row',  kana: [{r:'ka',h:'か'},{r:'ki',h:'き'},{r:'ku',h:'く'},{r:'ke',h:'け'},{r:'ko',h:'こ'}] },
  { name: 'S-row',  kana: [{r:'sa',h:'さ'},{r:'shi',h:'し'},{r:'su',h:'す'},{r:'se',h:'せ'},{r:'so',h:'そ'}] },
  { name: 'T-row',  kana: [{r:'ta',h:'た'},{r:'chi',h:'ち'},{r:'tsu',h:'つ'},{r:'te',h:'て'},{r:'to',h:'と'}] },
  { name: 'N-row',  kana: [{r:'na',h:'な'},{r:'ni',h:'に'},{r:'nu',h:'ぬ'},{r:'ne',h:'ね'},{r:'no',h:'の'}] },
  { name: 'H-row',  kana: [{r:'ha',h:'は'},{r:'hi',h:'ひ'},{r:'fu',h:'ふ'},{r:'he',h:'へ'},{r:'ho',h:'ほ'}] },
  { name: 'M-row',  kana: [{r:'ma',h:'ま'},{r:'mi',h:'み'},{r:'mu',h:'む'},{r:'me',h:'め'},{r:'mo',h:'も'}] },
  { name: 'Y-row',  kana: [{r:'ya',h:'や'},{r:'yu',h:'ゆ'},{r:'yo',h:'よ'}] },
  { name: 'R-row',  kana: [{r:'ra',h:'ら'},{r:'ri',h:'り'},{r:'ru',h:'る'},{r:'re',h:'れ'},{r:'ro',h:'ろ'}] },
  { name: 'W / N',  kana: [{r:'wa',h:'わ'},{r:'wo',h:'を'},{r:'n',h:'ん'}] },
];

// ══════════════════════════════════════════════════════════════════
//  WORD LIST — common short hiragana words for Typing mode.
//  "h" = hiragana spelling, "r" = correct romaji answer.
//  Only words fully spellable from the user's *selected* characters
//  will ever be shown; this is the full pool to filter from.
// ══════════════════════════════════════════════════════════════════
const WORDS = [
  { h: 'あい',   r: 'ai',      meaning: 'love',                  kanji: '愛' },
  { h: 'いえ',   r: 'ie',      meaning: 'house',                 kanji: '家' },
  { h: 'うえ',   r: 'ue',      meaning: 'up / above',            kanji: '上' },
  { h: 'いう',   r: 'iu',      meaning: 'to say',                kanji: '言う' },
  { h: 'あお',   r: 'ao',      meaning: 'blue',                  kanji: '青' },
  { h: 'かお',   r: 'kao',     meaning: 'face',                  kanji: '顔' },
  { h: 'あか',   r: 'aka',     meaning: 'red',                   kanji: '赤' },
  { h: 'いか',   r: 'ika',     meaning: 'squid',                 kanji: '烏賊' },
  { h: 'おかね',  r: 'okane',   meaning: 'money',                  kanji: 'お金' },
  { h: 'きく',   r: 'kiku',    meaning: 'to listen / chrysanthemum', kanji: '聞く' },
  { h: 'かく',   r: 'kaku',    meaning: 'to write',              kanji: '書く' },
  { h: 'えき',   r: 'eki',     meaning: 'station',               kanji: '駅' },
  { h: 'いけ',   r: 'ike',     meaning: 'pond',                  kanji: '池' },
  { h: 'こい',   r: 'koi',     meaning: 'carp / love',           kanji: '恋' },
  { h: 'ここ',   r: 'koko',    meaning: 'here',                  kanji: null },
  { h: 'さけ',   r: 'sake',    meaning: 'alcohol / salmon',      kanji: '酒' },
  { h: 'さき',   r: 'saki',    meaning: 'ahead / tip',           kanji: '先' },
  { h: 'しお',   r: 'shio',    meaning: 'salt',                  kanji: '塩' },
  { h: 'すし',   r: 'sushi',   meaning: 'sushi',                 kanji: null },
  { h: 'せかい',  r: 'sekai',   meaning: 'world',                  kanji: '世界' },
  { h: 'そら',   r: 'sora',    meaning: 'sky',                   kanji: '空' },
  { h: 'たこ',   r: 'tako',    meaning: 'octopus',               kanji: '蛸' },
  { h: 'ちかい',  r: 'chikai',  meaning: 'close / near',           kanji: '近い' },
  { h: 'つき',   r: 'tsuki',   meaning: 'moon',                  kanji: '月' },
  { h: 'てき',   r: 'teki',    meaning: 'enemy',                 kanji: '敵' },
  { h: 'とけい',  r: 'tokei',   meaning: 'clock / watch',          kanji: '時計' },
  { h: 'なつ',   r: 'natsu',   meaning: 'summer',                kanji: '夏' },
  { h: 'にく',   r: 'niku',    meaning: 'meat',                  kanji: '肉' },
  { h: 'ねこ',   r: 'neko',    meaning: 'cat',                   kanji: '猫' },
  { h: 'のり',   r: 'nori',    meaning: 'seaweed',               kanji: '海苔' },
  { h: 'はな',   r: 'hana',    meaning: 'flower',                kanji: '花' },
  { h: 'ひと',   r: 'hito',    meaning: 'person',                kanji: '人' },
  { h: 'ふね',   r: 'fune',    meaning: 'boat',                  kanji: '船' },
  { h: 'へや',   r: 'heya',    meaning: 'room',                  kanji: '部屋' },
  { h: 'ほし',   r: 'hoshi',   meaning: 'star',                  kanji: '星' },
  { h: 'まち',   r: 'machi',   meaning: 'town',                  kanji: '町' },
  { h: 'みず',   r: 'mizu',    meaning: 'water',                 kanji: '水' },
  { h: 'むし',   r: 'mushi',   meaning: 'bug / insect',          kanji: '虫' },
  { h: 'めがね',  r: 'megane',  meaning: 'glasses',                kanji: '眼鏡' },
  { h: 'もも',   r: 'momo',    meaning: 'peach',                 kanji: '桃' },
  { h: 'やま',   r: 'yama',    meaning: 'mountain',              kanji: '山' },
  { h: 'ゆき',   r: 'yuki',    meaning: 'snow',                  kanji: '雪' },
  { h: 'よる',   r: 'yoru',    meaning: 'night',                 kanji: '夜' },
  { h: 'さくら',  r: 'sakura',  meaning: 'cherry blossom',         kanji: '桜' },
  { h: 'からて',  r: 'karate',  meaning: 'karate',                 kanji: null },
  { h: 'すいか',  r: 'suika',   meaning: 'watermelon',             kanji: '西瓜' },
  { h: 'たいよう', r: 'taiyou',  meaning: 'sun',                    kanji: '太陽' },
  { h: 'にほん',  r: 'nihon',   meaning: 'Japan',                  kanji: '日本' },
  { h: 'わたし',  r: 'watashi', meaning: 'I / me',                 kanji: '私' },
  { h: 'てがみ',  r: 'tegami',  meaning: 'letter (mail)',          kanji: '手紙' },
  { h: 'くるま',  r: 'kuruma',  meaning: 'car',                    kanji: '車' },
];

// Reverse lookup: hiragana char -> romaji key (built from GROUPS)
const HIRAGANA_TO_ROMAJI = {};
GROUPS.forEach(g => g.kana.forEach(k => { HIRAGANA_TO_ROMAJI[k.h] = k.r; }));

// True if every character in word.h has a romaji key present in selectedSet
function wordUsesOnlySelected(word, selectedSet) {
  for (const ch of word.h) {
    const romaji = HIRAGANA_TO_ROMAJI[ch];
    if (!romaji || !selectedSet.has(romaji)) return false;
  }
  return true;
}
