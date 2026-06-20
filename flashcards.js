// ══════════════════════════════════════════════════════════════════
//  FLASHCARD MODE — mastery queue: repeat misses, clear round on 100%
// ══════════════════════════════════════════════════════════════════
// "queue" holds the cards still needing a correct answer this round.
// Missed cards get re-inserted (shuffled back in); correct ones are removed.
// A round is complete when the queue is empty -> then a new round starts.
let allCards = [];       // full selected set, fixed for the session
let queue = [];          // cards remaining to master this round
let roundTotal = 0;      // size of queue at the start of the round (for progress)
let roundNumber = 1;
let seen = 0, right = 0, wrong = 0, revealed = false, currentChar = '';

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startNewRound() {
  queue = shuffle([...allCards]);
  roundTotal = queue.length;
}

function startFlashcardSession() {
  allCards = GROUPS.flatMap(g => g.kana).filter(k => selected.has(k.r));
  roundNumber = 1;
  startNewRound();
  seen = 0; right = 0; wrong = 0;
  ['seenCount','rightCount','wrongCount'].forEach(id => document.getElementById(id).textContent = '0');
  loadCard();
}

function loadCard() {
  revealed = false;
  document.getElementById('gradeRow').classList.remove('visible');
  document.getElementById('strokeWrap').classList.remove('visible');
  document.getElementById('strokeContainer').innerHTML = '';
  clearDrawCanvas();
  document.getElementById('drawSection').classList.remove('hidden');
  document.getElementById('overlayChar').classList.remove('visible');
  document.getElementById('compareBtn').disabled = true;
  document.getElementById('compareBtn').textContent = 'Compare';

  const card = queue[0];
  currentChar = card.h;
  const hEl = document.getElementById('hiragana');
  hEl.style.transition = 'none';
  hEl.style.opacity = '0';
  hEl.classList.remove('visible');

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      hEl.textContent = card.h;
      document.getElementById('romaji').textContent = card.r;
      hEl.style.transition = '';
      updateProgress();
    });
  });

  fetchStrokeSvg(card.h).catch(() => {});
}

async function reveal() {
  if (revealed) return;
  revealed = true;
  document.getElementById('compareBtn').disabled = false;
  const hEl = document.getElementById('hiragana');
  hEl.style.opacity = '';
  hEl.classList.add('visible');
  document.getElementById('gradeRow').classList.add('visible');
  seen++;
  document.getElementById('seenCount').textContent = seen;

  const container = document.getElementById('strokeContainer');
  container.innerHTML = '<div class="stroke-msg">Loading…</div>';
  document.getElementById('strokeWrap').classList.add('visible');

  try {
    const rawSvg = await fetchStrokeSvg(currentChar);
    const svgEl = buildColoredSvg(rawSvg);
    if (svgEl) {
      container.innerHTML = '';
      container.appendChild(svgEl);
    } else {
      container.innerHTML = '<div class="stroke-msg">—</div>';
    }
  } catch {
    container.innerHTML = '<div class="stroke-msg">unavailable</div>';
  }
}

function grade(correct) {
  const card = queue.shift(); // remove current card from front of queue
  recordResult(card.r, correct);

  if (correct) {
    right++;
    document.getElementById('rightCount').textContent = right;
    // mastered for this round — don't re-add
  } else {
    wrong++;
    document.getElementById('wrongCount').textContent = wrong;
    // re-insert at a random position later in the queue (not immediately next)
    const insertPos = queue.length === 0 ? 0 : Math.floor(Math.random() * queue.length) + 1;
    queue.splice(insertPos, 0, card);
  }

  if (queue.length === 0) {
    roundNumber++;
    flashRoundComplete();
    startNewRound();
  }
  loadCard();
}

function flashRoundComplete() {
  const label = document.getElementById('progressLabel');
  label.textContent = '✓ All correct!';
  label.style.color = 'var(--green)';
  setTimeout(() => { label.style.color = ''; }, 1200);
}

function advance() {
  // "Next" without grading = treat as skip, just move card to back of queue unchanged
  const card = queue.shift();
  queue.push(card);
  loadCard();
}

function updateProgress() {
  const remaining = queue.length;
  const masteredThisRound = roundTotal - remaining;
  const pct = roundTotal === 0 ? 0 : (masteredThisRound / roundTotal) * 100;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = `${masteredThisRound} / ${roundTotal} · round ${roundNumber}`;
}

document.getElementById('revealBtn').addEventListener('click', reveal);
document.getElementById('nextBtn').addEventListener('click', () => { if (!revealed) reveal(); else advance(); });
document.getElementById('gradeGood').addEventListener('click', () => grade(true));
document.getElementById('gradeBad').addEventListener('click', () => grade(false));

document.addEventListener('keydown', e => {
  if (!document.getElementById('screenPractice').classList.contains('active')) return;
  if (e.code === 'Space') { e.preventDefault(); reveal(); }
  if (e.code === 'ArrowRight' || e.code === 'Enter') { if (!revealed) reveal(); else advance(); }
  if (e.code === 'ArrowUp') grade(true);
  if (e.code === 'ArrowDown') grade(false);
});
