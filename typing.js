// ══════════════════════════════════════════════════════════════════
//  TYPING MODE — type the romaji for a hiragana word or combo
// ══════════════════════════════════════════════════════════════════
// "item" shape: { h: 'hiragana string', r: 'expected romaji', isWord: bool, key: stats-key, meaning?, kanji? }
let typeQueue = [];
let typeRoundTotal = 0;
let typeRoundNumber = 1;
let typeSeen = 0, typeRight = 0, typeWrong = 0;
let typeAnswered = false;
let currentTypeItem = null;

// Build a random 2–3 char combo from selected characters when no real word fits.
// Plain concatenation of romaji (e.g. か+わ -> "ka"+"wa" -> "kawa") works fine
// for regular (non-digraph, non-sokuon) hiragana, which is what GROUPS covers.
function randomCombo(selectedArr) {
  const len = Math.random() < 0.5 ? 2 : 3;
  const picks = [];
  for (let i = 0; i < len; i++) {
    picks.push(selectedArr[Math.floor(Math.random() * selectedArr.length)]);
  }
  return {
    h: picks.map(p => p.h).join(''),
    r: picks.map(p => p.r).join(''),
    isWord: false,
    key: picks.map(p => p.r).join('-')
  };
}

function buildTypeDeck() {
  const selectedArr = GROUPS.flatMap(g => g.kana).filter(k => selected.has(k.r));
  const selectedSet = new Set(selectedArr.map(k => k.r));

  const realWords = WORDS
    .filter(w => wordUsesOnlySelected(w, selectedSet))
    .map(w => ({ h: w.h, r: w.r, isWord: true, key: 'word:' + w.r, meaning: w.meaning, kanji: w.kanji }));

  // Target deck size: roughly one item per selected character, min 6, max 20
  const targetSize = Math.max(6, Math.min(20, selectedArr.length));

  let deck = shuffle([...realWords]).slice(0, targetSize);

  // Fill remainder with random combos if not enough real words matched
  while (deck.length < targetSize && selectedArr.length >= 2) {
    deck.push(randomCombo(selectedArr));
  }
  // Edge case: only 1 character selected — just drill that one character repeatedly
  if (selectedArr.length === 1) {
    deck = [{ h: selectedArr[0].h, r: selectedArr[0].r, isWord: false, key: selectedArr[0].r }];
  }

  return shuffle(deck);
}

function startTypingSession() {
  typeQueue = buildTypeDeck();
  typeRoundTotal = typeQueue.length;
  typeRoundNumber = 1;
  typeSeen = 0; typeRight = 0; typeWrong = 0;
  ['typeSeenCount','typeRightCount','typeWrongCount'].forEach(id => document.getElementById(id).textContent = '0');
  loadTypeItem();
}

function loadTypeItem() {
  typeAnswered = false;
  const item = typeQueue[0];
  currentTypeItem = item;

  document.getElementById('typeHiragana').textContent = item.h;
  document.getElementById('typeWordHint').textContent = '';
  const input = document.getElementById('typeInput');
  input.value = '';
  input.classList.remove('correct','incorrect');
  input.disabled = false;
  document.getElementById('typeFeedback').textContent = '';
  document.getElementById('typeFeedback').className = 'type-feedback';
  document.getElementById('typeWordInfo').classList.remove('visible');
  document.getElementById('typeWordKanji').textContent = '';
  document.getElementById('typeWordMeaning').textContent = '';
  document.getElementById('typeSubmitBtn').disabled = false;
  document.getElementById('typeNextBtn').disabled = true;
  updateTypeProgress();

  // Focus for quick typing (works well on desktop; on mobile the user taps anyway)
  setTimeout(() => input.focus(), 50);
}

function checkTypeAnswer() {
  if (typeAnswered) return;
  const input = document.getElementById('typeInput');
  const guess = input.value.trim().toLowerCase();
  if (guess === '') return;

  typeAnswered = true;
  typeSeen++;
  document.getElementById('typeSeenCount').textContent = typeSeen;

  const correct = guess === currentTypeItem.r;
  const feedback = document.getElementById('typeFeedback');

  input.disabled = true;
  document.getElementById('typeSubmitBtn').disabled = true;
  document.getElementById('typeNextBtn').disabled = false;

  if (correct) {
    typeRight++;
    document.getElementById('typeRightCount').textContent = typeRight;
    input.classList.add('correct');
    feedback.textContent = '✓ Correct!';
    feedback.classList.add('correct');
  } else {
    typeWrong++;
    document.getElementById('typeWrongCount').textContent = typeWrong;
    input.classList.add('incorrect');
    feedback.textContent = `✗ It was "${currentTypeItem.r}"`;
    feedback.classList.add('incorrect');
  }

  // Show kanji + meaning for real words
  if (currentTypeItem.isWord) {
    const infoEl = document.getElementById('typeWordInfo');
    const kanjiEl = document.getElementById('typeWordKanji');
    const meaningEl = document.getElementById('typeWordMeaning');
    kanjiEl.textContent = currentTypeItem.kanji || currentTypeItem.h;
    meaningEl.textContent = currentTypeItem.meaning || '';
    infoEl.classList.add('visible');
  }

  // Record per-character stats: for a word/combo, credit/penalize each character it contains
  for (const ch of currentTypeItem.h) {
    const romaji = HIRAGANA_TO_ROMAJI[ch];
    if (romaji) recordResult(romaji, correct);
  }

  // Mastery queue behavior: correct -> drop; wrong -> reshuffle back in later
  const item = typeQueue.shift();
  if (!correct) {
    const insertPos = typeQueue.length === 0 ? 0 : Math.floor(Math.random() * typeQueue.length) + 1;
    typeQueue.splice(insertPos, 0, item);
  }

  if (typeQueue.length === 0) {
    typeRoundNumber++;
    flashTypeRoundComplete();
    typeQueue = buildTypeDeck();
    typeRoundTotal = typeQueue.length;
  }
}

function advanceTypeItem() {
  if (!typeAnswered) return;
  loadTypeItem();
}

function flashTypeRoundComplete() {
  const label = document.getElementById('typeProgressLabel');
  label.textContent = '✓ All correct!';
  label.style.color = 'var(--green)';
  setTimeout(() => { label.style.color = ''; }, 1200);
}

function updateTypeProgress() {
  const remaining = typeQueue.length;
  const mastered = typeRoundTotal - remaining;
  const pct = typeRoundTotal === 0 ? 0 : (mastered / typeRoundTotal) * 100;
  document.getElementById('typeProgressFill').style.width = pct + '%';
  document.getElementById('typeProgressLabel').textContent = `${mastered} / ${typeRoundTotal} · round ${typeRoundNumber}`;
}

document.getElementById('typeSubmitBtn').addEventListener('click', checkTypeAnswer);
document.getElementById('typeNextBtn').addEventListener('click', advanceTypeItem);

document.getElementById('typeInput').addEventListener('keydown', e => {
  if (e.code === 'Enter') {
    e.preventDefault();
    if (!typeAnswered) checkTypeAnswer();
    else advanceTypeItem();
  }
});
