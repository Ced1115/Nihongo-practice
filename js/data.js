// ══════════════════════════════════════════════════════════════════
//  DATA — unified schema across all four sets (hiragana, katakana,
//  kanji, vocab). Every practicable item has the same shape:
//
//    { id, set, display, reading, romaji, meaning, group, level, type }
//
//  - id:       stable identifier, unique WITHIN its set (was: romaji
//              for kana, the character for kanji, the jp word for vocab)
//  - set:      'hiragana' | 'katakana' | 'kanji' | 'vocab'
//  - display:  what's shown as the primary prompt (the character/word)
//  - reading:  kana reading (kanji/vocab only; null for kana sets)
//  - romaji:   romanized reading, used for typing/reading-check modes
//  - meaning:  english meaning (kanji/vocab only; null for kana sets)
//  - group:    the row/grade/theme this belongs to, for the selection UI
//  - level:    JLPT level tag (vocab only; null otherwise)
//  - type:     word type tag (vocab only) or kanji-only: { onyomi, kunyomi }
//
//  Stats are tracked per "set:id" so identical-looking ids across sets
//  (unlikely here, but still) never collide.
// ══════════════════════════════════════════════════════════════════

const HIRAGANA_GROUPS = [
  // ── Basic kana ──
  { name: 'Vowels',  items: [{r:'a',h:'あ'},{r:'i',h:'い'},{r:'u',h:'う'},{r:'e',h:'え'},{r:'o',h:'お'}] },
  { name: 'K-row',   items: [{r:'ka',h:'か'},{r:'ki',h:'き'},{r:'ku',h:'く'},{r:'ke',h:'け'},{r:'ko',h:'こ'}] },
  { name: 'S-row',   items: [{r:'sa',h:'さ'},{r:'shi',h:'し'},{r:'su',h:'す'},{r:'se',h:'せ'},{r:'so',h:'そ'}] },
  { name: 'T-row',   items: [{r:'ta',h:'た'},{r:'chi',h:'ち'},{r:'tsu',h:'つ'},{r:'te',h:'て'},{r:'to',h:'と'}] },
  { name: 'N-row',   items: [{r:'na',h:'な'},{r:'ni',h:'に'},{r:'nu',h:'ぬ'},{r:'ne',h:'ね'},{r:'no',h:'の'}] },
  { name: 'H-row',   items: [{r:'ha',h:'は'},{r:'hi',h:'ひ'},{r:'fu',h:'ふ'},{r:'he',h:'へ'},{r:'ho',h:'ほ'}] },
  { name: 'M-row',   items: [{r:'ma',h:'ま'},{r:'mi',h:'み'},{r:'mu',h:'む'},{r:'me',h:'め'},{r:'mo',h:'も'}] },
  { name: 'Y-row',   items: [{r:'ya',h:'や'},{r:'yu',h:'ゆ'},{r:'yo',h:'よ'}] },
  { name: 'R-row',   items: [{r:'ra',h:'ら'},{r:'ri',h:'り'},{r:'ru',h:'る'},{r:'re',h:'れ'},{r:'ro',h:'ろ'}] },
  { name: 'W / N',   items: [{r:'wa',h:'わ'},{r:'wo',h:'を'},{r:'n',h:'ん'}] },
  // ── Dakuten (voiced) ──
  { name: 'G-row',   items: [{r:'ga',h:'が'},{r:'gi',h:'ぎ'},{r:'gu',h:'ぐ'},{r:'ge',h:'げ'},{r:'go',h:'ご'}] },
  { name: 'Z-row',   items: [{r:'za',h:'ざ'},{r:'ji',h:'じ'},{r:'zu',h:'ず'},{r:'ze',h:'ぜ'},{r:'zo',h:'ぞ'}] },
  { name: 'D-row',   items: [{r:'da',h:'だ'},{r:'di',h:'ぢ'},{r:'du',h:'づ'},{r:'de',h:'で'},{r:'do',h:'ど'}] },
  { name: 'B-row',   items: [{r:'ba',h:'ば'},{r:'bi',h:'び'},{r:'bu',h:'ぶ'},{r:'be',h:'べ'},{r:'bo',h:'ぼ'}] },
  // ── Handakuten (semi-voiced) ──
  { name: 'P-row',   items: [{r:'pa',h:'ぱ'},{r:'pi',h:'ぴ'},{r:'pu',h:'ぷ'},{r:'pe',h:'ぺ'},{r:'po',h:'ぽ'}] },
  // ── Combination kana (拗音) ──
  { name: 'K-comb',  items: [{r:'kya',h:'きゃ'},{r:'kyu',h:'きゅ'},{r:'kyo',h:'きょ'}] },
  { name: 'S-comb',  items: [{r:'sha',h:'しゃ'},{r:'shu',h:'しゅ'},{r:'sho',h:'しょ'}] },
  { name: 'T-comb',  items: [{r:'cha',h:'ちゃ'},{r:'chu',h:'ちゅ'},{r:'cho',h:'ちょ'}] },
  { name: 'N-comb',  items: [{r:'nya',h:'にゃ'},{r:'nyu',h:'にゅ'},{r:'nyo',h:'にょ'}] },
  { name: 'H-comb',  items: [{r:'hya',h:'ひゃ'},{r:'hyu',h:'ひゅ'},{r:'hyo',h:'ひょ'}] },
  { name: 'M-comb',  items: [{r:'mya',h:'みゃ'},{r:'myu',h:'みゅ'},{r:'myo',h:'みょ'}] },
  { name: 'R-comb',  items: [{r:'rya',h:'りゃ'},{r:'ryu',h:'りゅ'},{r:'ryo',h:'りょ'}] },
  { name: 'G-comb',  items: [{r:'gya',h:'ぎゃ'},{r:'gyu',h:'ぎゅ'},{r:'gyo',h:'ぎょ'}] },
  { name: 'J-comb',  items: [{r:'ja',h:'じゃ'},{r:'ju',h:'じゅ'},{r:'jo',h:'じょ'}] },
  { name: 'B-comb',  items: [{r:'bya',h:'びゃ'},{r:'byu',h:'びゅ'},{r:'byo',h:'びょ'}] },
  { name: 'P-comb',  items: [{r:'pya',h:'ぴゃ'},{r:'pyu',h:'ぴゅ'},{r:'pyo',h:'ぴょ'}] },
  // ── Special ──
  { name: 'Special', items: [{r:'tte',h:'っ'}] },
];

const KATAKANA_GROUPS = [
  // ── Basic kana ──
  { name: 'Vowels',  items: [{r:'a',h:'ア'},{r:'i',h:'イ'},{r:'u',h:'ウ'},{r:'e',h:'エ'},{r:'o',h:'オ'}] },
  { name: 'K-row',   items: [{r:'ka',h:'カ'},{r:'ki',h:'キ'},{r:'ku',h:'ク'},{r:'ke',h:'ケ'},{r:'ko',h:'コ'}] },
  { name: 'S-row',   items: [{r:'sa',h:'サ'},{r:'shi',h:'シ'},{r:'su',h:'ス'},{r:'se',h:'セ'},{r:'so',h:'ソ'}] },
  { name: 'T-row',   items: [{r:'ta',h:'タ'},{r:'chi',h:'チ'},{r:'tsu',h:'ツ'},{r:'te',h:'テ'},{r:'to',h:'ト'}] },
  { name: 'N-row',   items: [{r:'na',h:'ナ'},{r:'ni',h:'ニ'},{r:'nu',h:'ヌ'},{r:'ne',h:'ネ'},{r:'no',h:'ノ'}] },
  { name: 'H-row',   items: [{r:'ha',h:'ハ'},{r:'hi',h:'ヒ'},{r:'fu',h:'フ'},{r:'he',h:'ヘ'},{r:'ho',h:'ホ'}] },
  { name: 'M-row',   items: [{r:'ma',h:'マ'},{r:'mi',h:'ミ'},{r:'mu',h:'ム'},{r:'me',h:'メ'},{r:'mo',h:'モ'}] },
  { name: 'Y-row',   items: [{r:'ya',h:'ヤ'},{r:'yu',h:'ユ'},{r:'yo',h:'ヨ'}] },
  { name: 'R-row',   items: [{r:'ra',h:'ラ'},{r:'ri',h:'リ'},{r:'ru',h:'ル'},{r:'re',h:'レ'},{r:'ro',h:'ロ'}] },
  { name: 'W / N',   items: [{r:'wa',h:'ワ'},{r:'wo',h:'ヲ'},{r:'n',h:'ン'}] },
  // ── Dakuten (voiced) ──
  { name: 'G-row',   items: [{r:'ga',h:'ガ'},{r:'gi',h:'ギ'},{r:'gu',h:'グ'},{r:'ge',h:'ゲ'},{r:'go',h:'ゴ'}] },
  { name: 'Z-row',   items: [{r:'za',h:'ザ'},{r:'ji',h:'ジ'},{r:'zu',h:'ズ'},{r:'ze',h:'ゼ'},{r:'zo',h:'ゾ'}] },
  { name: 'D-row',   items: [{r:'da',h:'ダ'},{r:'di',h:'ヂ'},{r:'du',h:'ヅ'},{r:'de',h:'デ'},{r:'do',h:'ド'}] },
  { name: 'B-row',   items: [{r:'ba',h:'バ'},{r:'bi',h:'ビ'},{r:'bu',h:'ブ'},{r:'be',h:'ベ'},{r:'bo',h:'ボ'}] },
  // ── Handakuten (semi-voiced) ──
  { name: 'P-row',   items: [{r:'pa',h:'パ'},{r:'pi',h:'ピ'},{r:'pu',h:'プ'},{r:'pe',h:'ペ'},{r:'po',h:'ポ'}] },
  // ── Combination kana (拗音) ──
  { name: 'K-comb',  items: [{r:'kya',h:'キャ'},{r:'kyu',h:'キュ'},{r:'kyo',h:'キョ'}] },
  { name: 'S-comb',  items: [{r:'sha',h:'シャ'},{r:'shu',h:'シュ'},{r:'sho',h:'ショ'}] },
  { name: 'T-comb',  items: [{r:'cha',h:'チャ'},{r:'chu',h:'チュ'},{r:'cho',h:'チョ'}] },
  { name: 'N-comb',  items: [{r:'nya',h:'ニャ'},{r:'nyu',h:'ニュ'},{r:'nyo',h:'ニョ'}] },
  { name: 'H-comb',  items: [{r:'hya',h:'ヒャ'},{r:'hyu',h:'ヒュ'},{r:'hyo',h:'ヒョ'}] },
  { name: 'M-comb',  items: [{r:'mya',h:'ミャ'},{r:'myu',h:'ミュ'},{r:'myo',h:'ミョ'}] },
  { name: 'R-comb',  items: [{r:'rya',h:'リャ'},{r:'ryu',h:'リュ'},{r:'ryo',h:'リョ'}] },
  { name: 'G-comb',  items: [{r:'gya',h:'ギャ'},{r:'gyu',h:'ギュ'},{r:'gyo',h:'ギョ'}] },
  { name: 'J-comb',  items: [{r:'ja',h:'ジャ'},{r:'ju',h:'ジュ'},{r:'jo',h:'ジョ'}] },
  { name: 'B-comb',  items: [{r:'bya',h:'ビャ'},{r:'byu',h:'ビュ'},{r:'byo',h:'ビョ'}] },
  { name: 'P-comb',  items: [{r:'pya',h:'ピャ'},{r:'pyu',h:'ピュ'},{r:'pyo',h:'ピョ'}] },
  // ── Special ──
  { name: 'Special', items: [{r:'tte',h:'ッ'},{r:'aa',h:'ー'}] },
];

// Hiragana/katakana word lists (kept from the original apps) — used by
// each set's typing mode for word/combo generation.
const HIRAGANA_WORDS = [
  { h:'あい', r:'ai', meaning:'love', kanji:'愛' },
  { h:'いえ', r:'ie', meaning:'house', kanji:'家' },
  { h:'うえ', r:'ue', meaning:'up / above', kanji:'上' },
  { h:'いう', r:'iu', meaning:'to say', kanji:'言う' },
  { h:'あお', r:'ao', meaning:'blue', kanji:'青' },
  { h:'かお', r:'kao', meaning:'face', kanji:'顔' },
  { h:'あか', r:'aka', meaning:'red', kanji:'赤' },
  { h:'いか', r:'ika', meaning:'squid', kanji:'烏賊' },
  { h:'おかね', r:'okane', meaning:'money', kanji:'お金' },
  { h:'きく', r:'kiku', meaning:'to listen / chrysanthemum', kanji:'聞く' },
  { h:'かく', r:'kaku', meaning:'to write', kanji:'書く' },
  { h:'えき', r:'eki', meaning:'station', kanji:'駅' },
  { h:'いけ', r:'ike', meaning:'pond', kanji:'池' },
  { h:'こい', r:'koi', meaning:'carp / love', kanji:'恋' },
  { h:'ここ', r:'koko', meaning:'here', kanji:null },
  { h:'さけ', r:'sake', meaning:'alcohol / salmon', kanji:'酒' },
  { h:'さき', r:'saki', meaning:'ahead / tip', kanji:'先' },
  { h:'しお', r:'shio', meaning:'salt', kanji:'塩' },
  { h:'すし', r:'sushi', meaning:'sushi', kanji:null },
  { h:'せかい', r:'sekai', meaning:'world', kanji:'世界' },
  { h:'そら', r:'sora', meaning:'sky', kanji:'空' },
  { h:'たこ', r:'tako', meaning:'octopus', kanji:'蛸' },
  { h:'ちかい', r:'chikai', meaning:'close / near', kanji:'近い' },
  { h:'つき', r:'tsuki', meaning:'moon', kanji:'月' },
  { h:'てき', r:'teki', meaning:'enemy', kanji:'敵' },
  { h:'とけい', r:'tokei', meaning:'clock / watch', kanji:'時計' },
  { h:'なつ', r:'natsu', meaning:'summer', kanji:'夏' },
  { h:'にく', r:'niku', meaning:'meat', kanji:'肉' },
  { h:'ねこ', r:'neko', meaning:'cat', kanji:'猫' },
  { h:'のり', r:'nori', meaning:'seaweed', kanji:'海苔' },
  { h:'はな', r:'hana', meaning:'flower', kanji:'花' },
  { h:'ひと', r:'hito', meaning:'person', kanji:'人' },
  { h:'ふね', r:'fune', meaning:'boat', kanji:'船' },
  { h:'へや', r:'heya', meaning:'room', kanji:'部屋' },
  { h:'ほし', r:'hoshi', meaning:'star', kanji:'星' },
  { h:'まち', r:'machi', meaning:'town', kanji:'町' },
  { h:'みず', r:'mizu', meaning:'water', kanji:'水' },
  { h:'むし', r:'mushi', meaning:'bug', kanji:'虫' },
  { h:'めがね', r:'megane', meaning:'glasses', kanji:'眼鏡' },
  { h:'もも', r:'momo', meaning:'peach', kanji:'桃' },
  { h:'やま', r:'yama', meaning:'mountain', kanji:'山' },
  { h:'ゆき', r:'yuki', meaning:'snow', kanji:'雪' },
  { h:'よる', r:'yoru', meaning:'night', kanji:'夜' },
  { h:'さくら', r:'sakura', meaning:'cherry blossom', kanji:'桜' },
  { h:'からて', r:'karate', meaning:'karate', kanji:null },
  { h:'すいか', r:'suika', meaning:'watermelon', kanji:'西瓜' },
  { h:'たいよう', r:'taiyou', meaning:'sun', kanji:'太陽' },
  { h:'にほん', r:'nihon', meaning:'Japan', kanji:'日本' },
  { h:'わたし', r:'watashi', meaning:'I / me', kanji:'私' },
  { h:'てがみ', r:'tegami', meaning:'letter (mail)', kanji:'手紙' },
  { h:'くるま', r:'kuruma', meaning:'car', kanji:'車' },
];

const KATAKANA_WORDS = [
  { h: 'コーヒー', r: 'koohii',   meaning: 'coffee',        kanji: null },
  { h: 'テレビ',   r: 'terebi',   meaning: 'television',    kanji: null },
  { h: 'パン',     r: 'pan',      meaning: 'bread',         kanji: null },
  { h: 'カメラ',   r: 'kamera',   meaning: 'camera',        kanji: null },
  { h: 'タクシー', r: 'takushii', meaning: 'taxi',          kanji: null },
  { h: 'ホテル',   r: 'hoteru',   meaning: 'hotel',         kanji: null },
  { h: 'アイス',   r: 'aisu',     meaning: 'ice / ice cream', kanji: null },
  { h: 'ケーキ',   r: 'keeki',    meaning: 'cake',          kanji: null },
  { h: 'ニュース', r: 'nyuusu',   meaning: 'news',          kanji: null },
  { h: 'マスク',   r: 'masuku',   meaning: 'mask',          kanji: null },
  { h: 'バス',     r: 'basu',     meaning: 'bus',           kanji: null },
  { h: 'ノート',   r: 'nooto',    meaning: 'notebook',      kanji: null },
  { h: 'ナイフ',   r: 'naifu',    meaning: 'knife',         kanji: null },
  { h: 'スキー',   r: 'sukii',    meaning: 'ski / skiing',  kanji: null },
  { h: 'ピザ',     r: 'piza',     meaning: 'pizza',         kanji: null },
  { h: 'ロボット', r: 'robotto',  meaning: 'robot',         kanji: null },
  { h: 'ギター',   r: 'gitaa',    meaning: 'guitar',        kanji: null },
  { h: 'チーズ',   r: 'chiizu',   meaning: 'cheese',        kanji: null },
  { h: 'バナナ',   r: 'banana',   meaning: 'banana',        kanji: null },
  { h: 'レモン',   r: 'remon',    meaning: 'lemon',         kanji: null },
  { h: 'メニュー', r: 'menyuu',   meaning: 'menu',          kanji: null },
  { h: 'カード',   r: 'kaado',    meaning: 'card',          kanji: null },
  { h: 'サラダ',   r: 'sarada',   meaning: 'salad',         kanji: null },
  { h: 'ソファ',   r: 'sofa',     meaning: 'sofa',          kanji: null },
  { h: 'ストア',   r: 'sutoa',    meaning: 'store',         kanji: null },
  { h: 'スポーツ', r: 'supootsu', meaning: 'sports',        kanji: null },
  { h: 'チケット', r: 'chiketto', meaning: 'ticket',        kanji: null },
  { h: 'パーティー', r: 'paatii', meaning: 'party',         kanji: null },
  { h: 'コップ',   r: 'koppu',    meaning: 'cup / glass',   kanji: null },
  { h: 'テスト',   r: 'tesuto',   meaning: 'test',          kanji: null },
  { h: 'インク',   r: 'inku',     meaning: 'ink',           kanji: null },
  { h: 'エアコン', r: 'eakon',    meaning: 'air conditioner', kanji: null },
  { h: 'オレンジ', r: 'orenji',   meaning: 'orange',        kanji: null },
  { h: 'キッチン', r: 'kicchin',  meaning: 'kitchen',       kanji: null },
  { h: 'クラス',   r: 'kurasu',   meaning: 'class',         kanji: null },
  { h: 'ゲーム',   r: 'geemu',    meaning: 'game',          kanji: null },
  { h: 'サイン',   r: 'sain',     meaning: 'sign / signature', kanji: null },
  { h: 'タイヤ',   r: 'taiya',    meaning: 'tire',          kanji: null },
  { h: 'ドア',     r: 'doa',      meaning: 'door',          kanji: null },
  { h: 'バッグ',   r: 'baggu',    meaning: 'bag',           kanji: null },
  { h: 'パスタ',   r: 'pasuta',   meaning: 'pasta',         kanji: null },
  { h: 'ビル',     r: 'biru',     meaning: 'building',      kanji: null },
  { h: 'プール',   r: 'puuru',    meaning: 'pool',          kanji: null },
  { h: 'ページ',   r: 'peeji',    meaning: 'page',          kanji: null },
  { h: 'ペン',     r: 'pen',      meaning: 'pen',           kanji: null },
  { h: 'ボタン',   r: 'botan',    meaning: 'button',        kanji: null },
  { h: 'マップ',   r: 'mappu',    meaning: 'map',           kanji: null },
  { h: 'メール',   r: 'meeru',    meaning: 'email',         kanji: null },
  { h: 'ラジオ',   r: 'rajio',    meaning: 'radio',         kanji: null },
  { h: 'レストラン', r: 'resutoran', meaning: 'restaurant',  kanji: null },
  { h: 'アメリカ', r: 'amerika',  meaning: 'America',       kanji: null },
];

// ══════════════════════════════════════════════════════════════════
//  KANJI — first 100 kyōiku kanji (80 Grade-1 + 20 Grade-2)
// ══════════════════════════════════════════════════════════════════
const KANJI_GROUPS = [
  {
    name: 'Grade 1',
    items: [
      { k:'一', meaning:'one', onyomi:['イチ','イツ'], kunyomi:['ひと','ひと-つ'] },
      { k:'二', meaning:'two', onyomi:['ニ'], kunyomi:['ふた','ふた-つ'] },
      { k:'三', meaning:'three', onyomi:['サン'], kunyomi:['み','み-つ','みっ-つ'] },
      { k:'四', meaning:'four', onyomi:['シ'], kunyomi:['よ','よ-つ','よっ-つ','よん'] },
      { k:'五', meaning:'five', onyomi:['ゴ'], kunyomi:['いつ','いつ-つ'] },
      { k:'六', meaning:'six', onyomi:['ロク'], kunyomi:['む','む-つ','むっ-つ','むい'] },
      { k:'七', meaning:'seven', onyomi:['シチ'], kunyomi:['なな','なな-つ','なの'] },
      { k:'八', meaning:'eight', onyomi:['ハチ'], kunyomi:['や','や-つ','やっ-つ','よう'] },
      { k:'九', meaning:'nine', onyomi:['キュウ','ク'], kunyomi:['ここの','ここの-つ'] },
      { k:'十', meaning:'ten', onyomi:['ジュウ'], kunyomi:['とお','と'] },
      { k:'百', meaning:'hundred', onyomi:['ヒャク'], kunyomi:[] },
      { k:'千', meaning:'thousand', onyomi:['セン'], kunyomi:[] },
      { k:'円', meaning:'circle, yen', onyomi:['エン'], kunyomi:['まる-い'] },
      { k:'人', meaning:'person', onyomi:['ジン','ニン'], kunyomi:['ひと'] },
      { k:'子', meaning:'child', onyomi:['シ','（ス）'], kunyomi:['こ'] },
      { k:'女', meaning:'woman', onyomi:['ジョ','（ニョ）'], kunyomi:['おんな'] },
      { k:'男', meaning:'man', onyomi:['ダン','ナン'], kunyomi:['おとこ'] },
      { k:'王', meaning:'king', onyomi:['オウ'], kunyomi:[] },
      { k:'目', meaning:'eye', onyomi:['モク','（ボク）'], kunyomi:['め'] },
      { k:'耳', meaning:'ear', onyomi:['ジ'], kunyomi:['みみ'] },
      { k:'口', meaning:'mouth', onyomi:['コウ','（ク）'], kunyomi:['くち'] },
      { k:'手', meaning:'hand', onyomi:['シュ'], kunyomi:['て'] },
      { k:'足', meaning:'foot, leg', onyomi:['ソク'], kunyomi:['あし','た-す','た-りる','た-る'] },
      { k:'力', meaning:'power', onyomi:['リョク','リキ'], kunyomi:['ちから'] },
      { k:'立', meaning:'stand', onyomi:['リツ','（リュウ）'], kunyomi:['た-つ','た-てる'] },
      { k:'休', meaning:'rest', onyomi:['キュウ'], kunyomi:['やす-む','やす-まる','やす-める'] },
      { k:'見', meaning:'see', onyomi:['ケン'], kunyomi:['み-る','み-える','み-せる'] },
      { k:'生', meaning:'life, birth', onyomi:['セイ','ショウ'], kunyomi:['い-きる','い-かす','う-む','うまれる','は-える','なま'] },
      { k:'正', meaning:'correct', onyomi:['セイ','ショウ'], kunyomi:['ただ-しい','ただ-す'] },
      { k:'大', meaning:'large, big', onyomi:['ダイ','タイ'], kunyomi:['おお-きい'] },
      { k:'小', meaning:'small', onyomi:['ショウ'], kunyomi:['こ','お','ちい-さい'] },
      { k:'上', meaning:'up, above', onyomi:['ジョウ'], kunyomi:['うえ','うわ','かみ','あ-げる','あ-がる','のぼ-る'] },
      { k:'下', meaning:'down, below', onyomi:['カ','ゲ'], kunyomi:['しも','もと','さ-げる','くだ-る','お-りる'] },
      { k:'中', meaning:'middle, inside', onyomi:['チュウ'], kunyomi:['なか'] },
      { k:'左', meaning:'left', onyomi:['サ'], kunyomi:['ひだり'] },
      { k:'右', meaning:'right', onyomi:['ユウ','ウ'], kunyomi:['みぎ'] },
      { k:'車', meaning:'car, vehicle', onyomi:['シャ'], kunyomi:['くるま'] },
      { k:'白', meaning:'white', onyomi:['ハク','（ビャク）'], kunyomi:['しろ','しら-','しろ-い'] },
      { k:'赤', meaning:'red', onyomi:['セキ'], kunyomi:['あか','あか-い'] },
      { k:'青', meaning:'blue, green', onyomi:['セイ','（ショウ）'], kunyomi:['あお','あお-い'] },
      { k:'天', meaning:'heaven, sky', onyomi:['テン'], kunyomi:['あめ','あま-'] },
      { k:'空', meaning:'sky, empty', onyomi:['クウ'], kunyomi:['そら','あ-く','あ-ける','から'] },
      { k:'雨', meaning:'rain', onyomi:['ウ'], kunyomi:['あめ','（あま）'] },
      { k:'山', meaning:'mountain', onyomi:['サン'], kunyomi:['やま'] },
      { k:'川', meaning:'river', onyomi:['セン'], kunyomi:['かわ'] },
      { k:'田', meaning:'rice field', onyomi:['デン'], kunyomi:['た'] },
      { k:'土', meaning:'soil, earth', onyomi:['ド','ト'], kunyomi:['つち'] },
      { k:'石', meaning:'stone', onyomi:['セキ','（シャク）'], kunyomi:['いし'] },
      { k:'火', meaning:'fire', onyomi:['カ'], kunyomi:['ひ','（ほ）'] },
      { k:'水', meaning:'water', onyomi:['スイ'], kunyomi:['みず'] },
      { k:'木', meaning:'tree, wood', onyomi:['モク','（ボク）'], kunyomi:['き','こ'] },
      { k:'林', meaning:'grove, woods', onyomi:['リン'], kunyomi:['はやし'] },
      { k:'森', meaning:'forest', onyomi:['シン'], kunyomi:['もり'] },
      { k:'花', meaning:'flower', onyomi:['カ'], kunyomi:['はな'] },
      { k:'草', meaning:'grass', onyomi:['ソウ'], kunyomi:['くさ'] },
      { k:'竹', meaning:'bamboo', onyomi:['チク'], kunyomi:['たけ'] },
      { k:'虫', meaning:'insect, bug', onyomi:['チュウ'], kunyomi:['むし'] },
      { k:'貝', meaning:'shellfish', onyomi:[], kunyomi:['かい'] },
      { k:'犬', meaning:'dog', onyomi:['ケン'], kunyomi:['いぬ'] },
      { k:'玉', meaning:'jewel, ball', onyomi:['ギョク'], kunyomi:['たま'] },
      { k:'金', meaning:'gold, money', onyomi:['キン','コン'], kunyomi:['かね','（かな）'] },
      { k:'年', meaning:'year', onyomi:['ネン'], kunyomi:['とし'] },
      { k:'月', meaning:'month, moon', onyomi:['ゲツ','ガツ'], kunyomi:['つき'] },
      { k:'日', meaning:'day, sun', onyomi:['ニチ','ジツ'], kunyomi:['ひ','か'] },
      { k:'本', meaning:'book, origin', onyomi:['ホン'], kunyomi:['もと'] },
      { k:'文', meaning:'sentence, writing', onyomi:['ブン','モン'], kunyomi:['ふみ'] },
      { k:'字', meaning:'character, letter', onyomi:['ジ'], kunyomi:['あざ'] },
      { k:'名', meaning:'name', onyomi:['メイ','ミョウ'], kunyomi:['な'] },
      { k:'音', meaning:'sound', onyomi:['オン','イン'], kunyomi:['おと','ね'] },
      { k:'早', meaning:'early, fast', onyomi:['ソウ','（サッ）'], kunyomi:['はや-い','はや-まる','はや-める'] },
      { k:'夕', meaning:'evening', onyomi:['セキ'], kunyomi:['ゆう'] },
      { k:'糸', meaning:'thread', onyomi:['シ'], kunyomi:['いと'] },
      { k:'気', meaning:'spirit, feeling', onyomi:['キ','ケ'], kunyomi:[] },
      { k:'学', meaning:'study, learning', onyomi:['ガク'], kunyomi:['まな-ぶ'] },
      { k:'校', meaning:'school', onyomi:['コウ'], kunyomi:[] },
      { k:'先', meaning:'before, ahead', onyomi:['セン'], kunyomi:['さき'] },
      { k:'入', meaning:'enter', onyomi:['ニュウ'], kunyomi:['い-る','い-れる','はい-る'] },
      { k:'出', meaning:'exit, leave', onyomi:['シュツ'], kunyomi:['で-る','だ-す'] },
      { k:'町', meaning:'town', onyomi:['チョウ'], kunyomi:['まち'] },
      { k:'村', meaning:'village', onyomi:['ソン'], kunyomi:['むら'] },
    ]
  },
  {
    name: 'Grade 2 (start)',
    items: [
      { k:'引', meaning:'pull', onyomi:['イン'], kunyomi:['ひ-く','ひ-ける'] },
      { k:'羽', meaning:'feather', onyomi:['ウ'], kunyomi:['は','はね'] },
      { k:'雲', meaning:'cloud', onyomi:['ウン'], kunyomi:['くも'] },
      { k:'園', meaning:'garden', onyomi:['エン'], kunyomi:['その'] },
      { k:'遠', meaning:'far', onyomi:['エン'], kunyomi:['とお-い'] },
      { k:'何', meaning:'what', onyomi:['カ'], kunyomi:['なに','（なん）'] },
      { k:'科', meaning:'department', onyomi:['カ'], kunyomi:[] },
      { k:'夏', meaning:'summer', onyomi:['カ','（ゲ）'], kunyomi:['なつ'] },
      { k:'家', meaning:'house', onyomi:['カ','ケ'], kunyomi:['いえ','や'] },
      { k:'歌', meaning:'song', onyomi:['カ'], kunyomi:['うた','うた-う'] },
      { k:'画', meaning:'picture', onyomi:['ガ','カク'], kunyomi:[] },
      { k:'回', meaning:'times, turn', onyomi:['カイ','（エ）'], kunyomi:['まわ-る','まわ-す'] },
      { k:'会', meaning:'meeting', onyomi:['カイ','エ'], kunyomi:['あ-う'] },
      { k:'海', meaning:'sea', onyomi:['カイ'], kunyomi:['うみ'] },
      { k:'絵', meaning:'picture, drawing', onyomi:['カイ','エ'], kunyomi:[] },
      { k:'外', meaning:'outside', onyomi:['ガイ','（ゲ）'], kunyomi:['そと','ほか','はず-す'] },
      { k:'角', meaning:'angle, corner', onyomi:['カク'], kunyomi:['かど','つの'] },
      { k:'楽', meaning:'pleasure, music', onyomi:['ガク','ラク'], kunyomi:['たの-しい','たの-しむ'] },
      { k:'活', meaning:'active, life', onyomi:['カツ'], kunyomi:[] },
      { k:'間', meaning:'interval, between', onyomi:['カン','ケン'], kunyomi:['あいだ','ま'] },
    ]
  }
];

// ══════════════════════════════════════════════════════════════════
//  VOCAB — JLPT N5 + N4 by theme (unchanged from the standalone app)
// ══════════════════════════════════════════════════════════════════
const VOCAB_THEMES = [
  {
    name: 'Time & Calendar',
    items: [
      { jp:'今日', kana:'きょう', r:'kyou', meaning:'today', level:'N5', type:'noun' },
      { jp:'明日', kana:'あした', r:'ashita', meaning:'tomorrow', level:'N5', type:'noun' },
      { jp:'昨日', kana:'きのう', r:'kinou', meaning:'yesterday', level:'N5', type:'noun' },
      { jp:'明後日', kana:'あさって', r:'asatte', meaning:'day after tomorrow', level:'N5', type:'noun' },
      { jp:'今', kana:'いま', r:'ima', meaning:'now', level:'N5', type:'noun' },
      { jp:'朝', kana:'あさ', r:'asa', meaning:'morning', level:'N5', type:'noun' },
      { jp:'昼', kana:'ひる', r:'hiru', meaning:'noon, daytime', level:'N5', type:'noun' },
      { jp:'夜', kana:'よる', r:'yoru', meaning:'night', level:'N5', type:'noun' },
      { jp:'毎日', kana:'まいにち', r:'mainichi', meaning:'every day', level:'N5', type:'noun' },
      { jp:'毎朝', kana:'まいあさ', r:'maiasa', meaning:'every morning', level:'N5', type:'noun' },
      { jp:'今週', kana:'こんしゅう', r:'konshuu', meaning:'this week', level:'N5', type:'noun' },
      { jp:'来週', kana:'らいしゅう', r:'raishuu', meaning:'next week', level:'N5', type:'noun' },
      { jp:'先週', kana:'せんしゅう', r:'senshuu', meaning:'last week', level:'N5', type:'noun' },
      { jp:'今月', kana:'こんげつ', r:'kongetsu', meaning:'this month', level:'N5', type:'noun' },
      { jp:'来月', kana:'らいげつ', r:'raigetsu', meaning:'next month', level:'N5', type:'noun' },
      { jp:'今年', kana:'こんねん', r:'konnen', meaning:'this year', level:'N5', type:'noun' },
      { jp:'来年', kana:'らいねん', r:'rainen', meaning:'next year', level:'N5', type:'noun' },
      { jp:'去年', kana:'きょねん', r:'kyonen', meaning:'last year', level:'N5', type:'noun' },
      { jp:'時間', kana:'じかん', r:'jikan', meaning:'time, hour', level:'N5', type:'noun' },
      { jp:'分', kana:'ふん', r:'fun', meaning:'minute', level:'N5', type:'noun' },
      { jp:'秒', kana:'びょう', r:'byou', meaning:'second', level:'N4', type:'noun' },
      { jp:'週間', kana:'しゅうかん', r:'shuukan', meaning:'week (duration)', level:'N4', type:'noun' },
      { jp:'最近', kana:'さいきん', r:'saikin', meaning:'recently', level:'N4', type:'adverb' },
      { jp:'最初', kana:'さいしょ', r:'saisho', meaning:'at first, beginning', level:'N4', type:'noun' },
      { jp:'最後', kana:'さいご', r:'saigo', meaning:'last, final', level:'N4', type:'noun' },
      { jp:'最中', kana:'さいちゅう', r:'saichuu', meaning:'in the middle of', level:'N4', type:'noun' },
    ]
  },
  {
    name: 'Food & Drink',
    items: [
      { jp:'御飯', kana:'ごはん', r:'gohan', meaning:'rice, meal', level:'N5', type:'noun' },
      { jp:'朝御飯', kana:'あさごはん', r:'asagohan', meaning:'breakfast', level:'N5', type:'noun' },
      { jp:'昼御飯', kana:'ひるごはん', r:'hirugohan', meaning:'lunch', level:'N5', type:'noun' },
      { jp:'晩御飯', kana:'ばんごはん', r:'bangohan', meaning:'dinner', level:'N5', type:'noun' },
      { jp:'水', kana:'みず', r:'mizu', meaning:'water', level:'N5', type:'noun' },
      { jp:'お茶', kana:'おちゃ', r:'ocha', meaning:'tea', level:'N5', type:'noun' },
      { jp:'牛乳', kana:'ぎゅうにゅう', r:'gyuunyuu', meaning:'milk', level:'N5', type:'noun' },
      { jp:'肉', kana:'にく', r:'niku', meaning:'meat', level:'N5', type:'noun' },
      { jp:'魚', kana:'さかな', r:'sakana', meaning:'fish', level:'N5', type:'noun' },
      { jp:'野菜', kana:'やさい', r:'yasai', meaning:'vegetable', level:'N5', type:'noun' },
      { jp:'果物', kana:'くだもの', r:'kudamono', meaning:'fruit', level:'N5', type:'noun' },
      { jp:'卵', kana:'たまご', r:'tamago', meaning:'egg', level:'N5', type:'noun' },
      { jp:'パン', kana:'パン', r:'pan', meaning:'bread', level:'N5', type:'noun' },
      { jp:'お菓子', kana:'おかし', r:'okashi', meaning:'sweets, snack', level:'N5', type:'noun' },
      { jp:'食べる', kana:'たべる', r:'taberu', meaning:'to eat', level:'N5', type:'verb' },
      { jp:'飲む', kana:'のむ', r:'nomu', meaning:'to drink', level:'N5', type:'verb' },
      { jp:'美味しい', kana:'おいしい', r:'oishii', meaning:'delicious', level:'N5', type:'i-adj' },
      { jp:'辛い', kana:'からい', r:'karai', meaning:'spicy', level:'N4', type:'i-adj' },
      { jp:'甘い', kana:'あまい', r:'amai', meaning:'sweet', level:'N4', type:'i-adj' },
      { jp:'味', kana:'あじ', r:'aji', meaning:'taste, flavor', level:'N4', type:'noun' },
      { jp:'料理', kana:'りょうり', r:'ryouri', meaning:'cooking, cuisine', level:'N4', type:'noun' },
      { jp:'作る', kana:'つくる', r:'tsukuru', meaning:'to make', level:'N5', type:'verb' },
      { jp:'お腹', kana:'おなか', r:'onaka', meaning:'stomach, belly', level:'N4', type:'noun' },
      { jp:'喉', kana:'のど', r:'nodo', meaning:'throat', level:'N4', type:'noun' },
    ]
  },
  {
    name: 'Family & People',
    items: [
      { jp:'家族', kana:'かぞく', r:'kazoku', meaning:'family', level:'N5', type:'noun' },
      { jp:'父', kana:'ちち', r:'chichi', meaning:'father (own)', level:'N5', type:'noun' },
      { jp:'母', kana:'はは', r:'haha', meaning:'mother (own)', level:'N5', type:'noun' },
      { jp:'お父さん', kana:'おとうさん', r:'otousan', meaning:'father (others\' / polite)', level:'N5', type:'noun' },
      { jp:'お母さん', kana:'おかあさん', r:'okaasan', meaning:'mother (others\' / polite)', level:'N5', type:'noun' },
      { jp:'兄', kana:'あに', r:'ani', meaning:'older brother (own)', level:'N5', type:'noun' },
      { jp:'姉', kana:'あね', r:'ane', meaning:'older sister (own)', level:'N5', type:'noun' },
      { jp:'弟', kana:'おとうと', r:'otouto', meaning:'younger brother', level:'N5', type:'noun' },
      { jp:'妹', kana:'いもうと', r:'imouto', meaning:'younger sister', level:'N5', type:'noun' },
      { jp:'子供', kana:'こども', r:'kodomo', meaning:'child', level:'N5', type:'noun' },
      { jp:'友達', kana:'ともだち', r:'tomodachi', meaning:'friend', level:'N5', type:'noun' },
      { jp:'彼', kana:'かれ', r:'kare', meaning:'he, boyfriend', level:'N5', type:'noun' },
      { jp:'彼女', kana:'かのじょ', r:'kanojo', meaning:'she, girlfriend', level:'N5', type:'noun' },
      { jp:'先生', kana:'せんせい', r:'sensei', meaning:'teacher', level:'N5', type:'noun' },
      { jp:'学生', kana:'がくせい', r:'gakusei', meaning:'student', level:'N5', type:'noun' },
      { jp:'会社員', kana:'かいしゃいん', r:'kaishain', meaning:'office worker', level:'N5', type:'noun' },
      { jp:'名前', kana:'なまえ', r:'namae', meaning:'name', level:'N5', type:'noun' },
      { jp:'大人', kana:'おとな', r:'otona', meaning:'adult', level:'N4', type:'noun' },
      { jp:'お祖父さん', kana:'おじいさん', r:'ojiisan', meaning:'grandfather', level:'N5', type:'noun' },
      { jp:'お祖母さん', kana:'おばあさん', r:'obaasan', meaning:'grandmother', level:'N5', type:'noun' },
    ]
  },
  {
    name: 'Places & Buildings',
    items: [
      { jp:'家', kana:'いえ', r:'ie', meaning:'house', level:'N5', type:'noun' },
      { jp:'学校', kana:'がっこう', r:'gakkou', meaning:'school', level:'N5', type:'noun' },
      { jp:'会社', kana:'かいしゃ', r:'kaisha', meaning:'company', level:'N5', type:'noun' },
      { jp:'病院', kana:'びょういん', r:'byouin', meaning:'hospital', level:'N5', type:'noun' },
      { jp:'銀行', kana:'ぎんこう', r:'ginkou', meaning:'bank', level:'N5', type:'noun' },
      { jp:'郵便局', kana:'ゆうびんきょく', r:'yuubinkyoku', meaning:'post office', level:'N5', type:'noun' },
      { jp:'図書館', kana:'としょかん', r:'toshokan', meaning:'library', level:'N5', type:'noun' },
      { jp:'公園', kana:'こうえん', r:'kouen', meaning:'park', level:'N5', type:'noun' },
      { jp:'駅', kana:'えき', r:'eki', meaning:'station', level:'N5', type:'noun' },
      { jp:'店', kana:'みせ', r:'mise', meaning:'shop, store', level:'N5', type:'noun' },
      { jp:'町', kana:'まち', r:'machi', meaning:'town', level:'N5', type:'noun' },
      { jp:'国', kana:'くに', r:'kuni', meaning:'country', level:'N5', type:'noun' },
      { jp:'部屋', kana:'へや', r:'heya', meaning:'room', level:'N5', type:'noun' },
      { jp:'教室', kana:'きょうしつ', r:'kyoushitsu', meaning:'classroom', level:'N5', type:'noun' },
      { jp:'トイレ', kana:'トイレ', r:'toire', meaning:'toilet, bathroom', level:'N5', type:'noun' },
      { jp:'喫茶店', kana:'きっさてん', r:'kissaten', meaning:'cafe', level:'N4', type:'noun' },
      { jp:'空港', kana:'くうこう', r:'kuukou', meaning:'airport', level:'N4', type:'noun' },
      { jp:'建物', kana:'たてもの', r:'tatemono', meaning:'building', level:'N4', type:'noun' },
    ]
  },
  {
    name: 'Verbs — Daily Actions',
    items: [
      { jp:'行く', kana:'いく', r:'iku', meaning:'to go', level:'N5', type:'verb' },
      { jp:'来る', kana:'くる', r:'kuru', meaning:'to come', level:'N5', type:'verb' },
      { jp:'帰る', kana:'かえる', r:'kaeru', meaning:'to return, go home', level:'N5', type:'verb' },
      { jp:'見る', kana:'みる', r:'miru', meaning:'to see, watch', level:'N5', type:'verb' },
      { jp:'聞く', kana:'きく', r:'kiku', meaning:'to hear, listen, ask', level:'N5', type:'verb' },
      { jp:'話す', kana:'はなす', r:'hanasu', meaning:'to speak', level:'N5', type:'verb' },
      { jp:'読む', kana:'よむ', r:'yomu', meaning:'to read', level:'N5', type:'verb' },
      { jp:'書く', kana:'かく', r:'kaku', meaning:'to write', level:'N5', type:'verb' },
      { jp:'買う', kana:'かう', r:'kau', meaning:'to buy', level:'N5', type:'verb' },
      { jp:'売る', kana:'うる', r:'uru', meaning:'to sell', level:'N4', type:'verb' },
      { jp:'待つ', kana:'まつ', r:'matsu', meaning:'to wait', level:'N4', type:'verb' },
      { jp:'立つ', kana:'たつ', r:'tatsu', meaning:'to stand', level:'N5', type:'verb' },
      { jp:'座る', kana:'すわる', r:'suwaru', meaning:'to sit', level:'N5', type:'verb' },
      { jp:'寝る', kana:'ねる', r:'neru', meaning:'to sleep', level:'N5', type:'verb' },
      { jp:'起きる', kana:'おきる', r:'okiru', meaning:'to wake up, get up', level:'N5', type:'verb' },
      { jp:'働く', kana:'はたらく', r:'hataraku', meaning:'to work', level:'N5', type:'verb' },
      { jp:'休む', kana:'やすむ', r:'yasumu', meaning:'to rest, take a break', level:'N5', type:'verb' },
      { jp:'勉強する', kana:'べんきょうする', r:'benkyousuru', meaning:'to study', level:'N5', type:'verb' },
      { jp:'教える', kana:'おしえる', r:'oshieru', meaning:'to teach', level:'N5', type:'verb' },
      { jp:'習う', kana:'ならう', r:'narau', meaning:'to learn', level:'N4', type:'verb' },
      { jp:'分かる', kana:'わかる', r:'wakaru', meaning:'to understand', level:'N5', type:'verb' },
      { jp:'忘れる', kana:'わすれる', r:'wasureru', meaning:'to forget', level:'N4', type:'verb' },
      { jp:'覚える', kana:'おぼえる', r:'oboeru', meaning:'to remember, memorize', level:'N4', type:'verb' },
      { jp:'使う', kana:'つかう', r:'tsukau', meaning:'to use', level:'N5', type:'verb' },
      { jp:'始める', kana:'はじめる', r:'hajimeru', meaning:'to begin', level:'N4', type:'verb' },
      { jp:'終わる', kana:'おわる', r:'owaru', meaning:'to end, finish', level:'N4', type:'verb' },
      { jp:'手伝う', kana:'てつだう', r:'tetsudau', meaning:'to help', level:'N4', type:'verb' },
      { jp:'歩く', kana:'あるく', r:'aruku', meaning:'to walk', level:'N5', type:'verb' },
      { jp:'走る', kana:'はしる', r:'hashiru', meaning:'to run', level:'N5', type:'verb' },
      { jp:'遊ぶ', kana:'あそぶ', r:'asobu', meaning:'to play', level:'N5', type:'verb' },
    ]
  },
  {
    name: 'Adjectives & Descriptions',
    items: [
      { jp:'大きい', kana:'おおきい', r:'ookii', meaning:'big', level:'N5', type:'i-adj' },
      { jp:'小さい', kana:'ちいさい', r:'chiisai', meaning:'small', level:'N5', type:'i-adj' },
      { jp:'新しい', kana:'あたらしい', r:'atarashii', meaning:'new', level:'N5', type:'i-adj' },
      { jp:'古い', kana:'ふるい', r:'furui', meaning:'old (things)', level:'N5', type:'i-adj' },
      { jp:'良い', kana:'いい', r:'ii', meaning:'good', level:'N5', type:'i-adj' },
      { jp:'悪い', kana:'わるい', r:'warui', meaning:'bad', level:'N5', type:'i-adj' },
      { jp:'高い', kana:'たかい', r:'takai', meaning:'expensive, tall, high', level:'N5', type:'i-adj' },
      { jp:'安い', kana:'やすい', r:'yasui', meaning:'cheap', level:'N5', type:'i-adj' },
      { jp:'長い', kana:'ながい', r:'nagai', meaning:'long', level:'N5', type:'i-adj' },
      { jp:'短い', kana:'みじかい', r:'mijikai', meaning:'short', level:'N5', type:'i-adj' },
      { jp:'暑い', kana:'あつい', r:'atsui', meaning:'hot (weather)', level:'N5', type:'i-adj' },
      { jp:'寒い', kana:'さむい', r:'samui', meaning:'cold (weather)', level:'N5', type:'i-adj' },
      { jp:'暖かい', kana:'あたたかい', r:'atatakai', meaning:'warm', level:'N5', type:'i-adj' },
      { jp:'忙しい', kana:'いそがしい', r:'isogashii', meaning:'busy', level:'N5', type:'i-adj' },
      { jp:'楽しい', kana:'たのしい', r:'tanoshii', meaning:'fun, enjoyable', level:'N5', type:'i-adj' },
      { jp:'難しい', kana:'むずかしい', r:'muzukashii', meaning:'difficult', level:'N5', type:'i-adj' },
      { jp:'易しい', kana:'やさしい', r:'yasashii', meaning:'easy', level:'N4', type:'i-adj' },
      { jp:'優しい', kana:'やさしい', r:'yasashii', meaning:'kind, gentle', level:'N4', type:'i-adj' },
      { jp:'明るい', kana:'あかるい', r:'akarui', meaning:'bright, cheerful', level:'N5', type:'i-adj' },
      { jp:'暗い', kana:'くらい', r:'kurai', meaning:'dark', level:'N4', type:'i-adj' },
      { jp:'綺麗', kana:'きれい', r:'kirei', meaning:'pretty, clean', level:'N5', type:'na-adj' },
      { jp:'好き', kana:'すき', r:'suki', meaning:'likeable, favorite', level:'N5', type:'na-adj' },
      { jp:'嫌い', kana:'きらい', r:'kirai', meaning:'dislikeable', level:'N5', type:'na-adj' },
      { jp:'元気', kana:'げんき', r:'genki', meaning:'healthy, energetic', level:'N5', type:'na-adj' },
      { jp:'静か', kana:'しずか', r:'shizuka', meaning:'quiet', level:'N5', type:'na-adj' },
      { jp:'便利', kana:'べんり', r:'benri', meaning:'convenient', level:'N4', type:'na-adj' },
      { jp:'大変', kana:'たいへん', r:'taihen', meaning:'tough, terrible', level:'N4', type:'na-adj' },
      { jp:'親切', kana:'しんせつ', r:'shinsetsu', meaning:'kind (personality)', level:'N4', type:'na-adj' },
    ]
  },
  {
    name: 'Numbers & Counters',
    items: [
      { jp:'一つ', kana:'ひとつ', r:'hitotsu', meaning:'one (thing)', level:'N5', type:'noun' },
      { jp:'二つ', kana:'ふたつ', r:'futatsu', meaning:'two (things)', level:'N5', type:'noun' },
      { jp:'三つ', kana:'みっつ', r:'mittsu', meaning:'three (things)', level:'N5', type:'noun' },
      { jp:'人', kana:'にん', r:'nin', meaning:'counter for people', level:'N5', type:'noun' },
      { jp:'枚', kana:'まい', r:'mai', meaning:'counter for flat objects', level:'N5', type:'noun' },
      { jp:'本', kana:'ほん', r:'hon', meaning:'counter for long objects', level:'N5', type:'noun' },
      { jp:'匹', kana:'ひき', r:'hiki', meaning:'counter for small animals', level:'N5', type:'noun' },
      { jp:'円', kana:'えん', r:'en', meaning:'yen', level:'N5', type:'noun' },
      { jp:'歳', kana:'さい', r:'sai', meaning:'counter for age', level:'N5', type:'noun' },
      { jp:'回', kana:'かい', r:'kai', meaning:'counter for times/occurrences', level:'N4', type:'noun' },
      { jp:'半分', kana:'はんぶん', r:'hanbun', meaning:'half', level:'N4', type:'noun' },
      { jp:'全部', kana:'ぜんぶ', r:'zenbu', meaning:'all, everything', level:'N4', type:'noun' },
    ]
  },
  {
    name: 'Weather & Nature',
    items: [
      { jp:'天気', kana:'てんき', r:'tenki', meaning:'weather', level:'N5', type:'noun' },
      { jp:'雨', kana:'あめ', r:'ame', meaning:'rain', level:'N5', type:'noun' },
      { jp:'雪', kana:'ゆき', r:'yuki', meaning:'snow', level:'N5', type:'noun' },
      { jp:'風', kana:'かぜ', r:'kaze', meaning:'wind', level:'N5', type:'noun' },
      { jp:'空', kana:'そら', r:'sora', meaning:'sky', level:'N5', type:'noun' },
      { jp:'太陽', kana:'たいよう', r:'taiyou', meaning:'sun', level:'N4', type:'noun' },
      { jp:'月', kana:'つき', r:'tsuki', meaning:'moon', level:'N5', type:'noun' },
      { jp:'星', kana:'ほし', r:'hoshi', meaning:'star', level:'N5', type:'noun' },
      { jp:'山', kana:'やま', r:'yama', meaning:'mountain', level:'N5', type:'noun' },
      { jp:'川', kana:'かわ', r:'kawa', meaning:'river', level:'N5', type:'noun' },
      { jp:'海', kana:'うみ', r:'umi', meaning:'sea', level:'N5', type:'noun' },
      { jp:'木', kana:'き', r:'ki', meaning:'tree', level:'N5', type:'noun' },
      { jp:'花', kana:'はな', r:'hana', meaning:'flower', level:'N5', type:'noun' },
      { jp:'秋', kana:'あき', r:'aki', meaning:'autumn', level:'N5', type:'noun' },
      { jp:'夏', kana:'なつ', r:'natsu', meaning:'summer', level:'N5', type:'noun' },
      { jp:'冬', kana:'ふゆ', r:'fuyu', meaning:'winter', level:'N5', type:'noun' },
      { jp:'春', kana:'はる', r:'haru', meaning:'spring', level:'N5', type:'noun' },
    ]
  },
  {
    name: 'Transportation & Direction',
    items: [
      { jp:'電車', kana:'でんしゃ', r:'densha', meaning:'train', level:'N5', type:'noun' },
      { jp:'バス', kana:'バス', r:'basu', meaning:'bus', level:'N5', type:'noun' },
      { jp:'車', kana:'くるま', r:'kuruma', meaning:'car', level:'N5', type:'noun' },
      { jp:'自転車', kana:'じてんしゃ', r:'jitensha', meaning:'bicycle', level:'N5', type:'noun' },
      { jp:'飛行機', kana:'ひこうき', r:'hikouki', meaning:'airplane', level:'N5', type:'noun' },
      { jp:'地下鉄', kana:'ちかてつ', r:'chikatetsu', meaning:'subway', level:'N4', type:'noun' },
      { jp:'道', kana:'みち', r:'michi', meaning:'road, path', level:'N5', type:'noun' },
      { jp:'右', kana:'みぎ', r:'migi', meaning:'right', level:'N5', type:'noun' },
      { jp:'左', kana:'ひだり', r:'hidari', meaning:'left', level:'N5', type:'noun' },
      { jp:'前', kana:'まえ', r:'mae', meaning:'front, before', level:'N5', type:'noun' },
      { jp:'後ろ', kana:'うしろ', r:'ushiro', meaning:'behind', level:'N5', type:'noun' },
      { jp:'近い', kana:'ちかい', r:'chikai', meaning:'near', level:'N5', type:'i-adj' },
      { jp:'遠い', kana:'とおい', r:'tooi', meaning:'far', level:'N5', type:'i-adj' },
      { jp:'乗る', kana:'のる', r:'noru', meaning:'to ride, board', level:'N5', type:'verb' },
      { jp:'降りる', kana:'おりる', r:'oriru', meaning:'to get off, descend', level:'N4', type:'verb' },
      { jp:'渡る', kana:'わたる', r:'wataru', meaning:'to cross', level:'N4', type:'verb' },
    ]
  },
];

// ══════════════════════════════════════════════════════════════════
//  NORMALIZATION — converts each set's native shape into the shared
//  item schema used throughout the app.
// ══════════════════════════════════════════════════════════════════

function buildHiraganaSet() {
  return HIRAGANA_GROUPS.map(g => ({
    name: g.name,
    items: g.items.map(k => ({
      id: k.r, set: 'hiragana', display: k.h, reading: null,
      romaji: k.r, meaning: null, group: g.name, level: null, type: null
    }))
  }));
}

function buildKatakanaSet() {
  return KATAKANA_GROUPS.map(g => ({
    name: g.name,
    items: g.items.map(k => ({
      id: k.r, set: 'katakana', display: k.h, reading: null,
      romaji: k.r, meaning: null, group: g.name, level: null, type: null
    }))
  }));
}

function buildKanjiSet() {
  return KANJI_GROUPS.map(g => ({
    name: g.name,
    items: g.items.map(k => ({
      id: k.k, set: 'kanji', display: k.k, reading: null,
      romaji: null, meaning: k.meaning, group: g.name, level: null,
      type: null, onyomi: k.onyomi, kunyomi: k.kunyomi
    }))
  }));
}

function buildVocabSet() {
  return VOCAB_THEMES.map(t => ({
    name: t.name,
    items: t.items.map(w => ({
      id: w.jp, set: 'vocab', display: w.jp, reading: w.kana,
      romaji: w.r, meaning: w.meaning, group: t.name, level: w.level, type: w.type
    }))
  }));
}

const SETS = {
  hiragana: { label: 'Hiragana', jp: 'ひらがな', groups: buildHiraganaSet(), words: HIRAGANA_WORDS },
  katakana: { label: 'Katakana', jp: 'カタカナ', groups: buildKatakanaSet(), words: KATAKANA_WORDS },
  kanji:    { label: 'Kanji',    jp: '漢字',     groups: buildKanjiSet() },
  vocab:    { label: 'Vocab',    jp: '語彙',     groups: buildVocabSet() },
};

// Flat lookup: "set:id" -> item, used by storage/stats and (later) phrase mode
const ITEM_LOOKUP = {};
Object.entries(SETS).forEach(([setKey, setData]) => {
  setData.groups.forEach(g => g.items.forEach(item => {
    ITEM_LOOKUP[`${setKey}:${item.id}`] = item;
  }));
});

// Reverse lookup per kana set: character -> romaji (needed for word/combo typing modes)
const HIRAGANA_CHAR_TO_ROMAJI = {};
HIRAGANA_GROUPS.forEach(g => g.items.forEach(k => { HIRAGANA_CHAR_TO_ROMAJI[k.h] = k.r; }));
const KATAKANA_CHAR_TO_ROMAJI = {};
KATAKANA_GROUPS.forEach(g => g.items.forEach(k => { KATAKANA_CHAR_TO_ROMAJI[k.h] = k.r; }));

function wordUsesOnlySelected(word, selectedSet, charMap) {
  for (const ch of word.h) {
    const romaji = charMap[ch];
    if (!romaji || !selectedSet.has(romaji)) return false;
  }
  return true;
}
