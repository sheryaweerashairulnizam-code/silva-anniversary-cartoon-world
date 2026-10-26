/*
  SILVA CONFIG — edit this block to personalize the site.
  The date is intentionally blank so the site never invents your anniversary date.
*/
const CONFIG = window.SILVA_CONFIG = {
  anniversaryDate: "",
  musicVideoId: "Q49pnA4jsp8", // official wave to earth - love. lyric video on YouTube
  quiz: [
    {
      question: "kalau kita punya satu hari kosong, paling seru ngapain?",
      options: ["jalan tanpa tujuan + jajan", "marathon film sampai lupa waktu", "tidur dulu, baru bikin rencana"],
      correct: 0
    },
    {
      question: "siapa yang biasanya lebih dulu bilang 'aku kangen'?",
      options: ["aku dong hehe", "Silva dong (katanya sih)", "dua-duanya, pura-pura cool aja"],
      correct: 2
    },
    {
      question: "momen kecil mana yang paling bikin kita jadi kita?",
      options: ["ketawa karena hal random", "saling kirim meme", "semuanya, nggak bisa pilih satu"],
      correct: 2
    }
  ]
};

const PORORO_SVG = `
<svg viewBox="0 0 260 320" role="img" aria-label="Pororo dengan helm kuning dan kacamata oranye" xmlns="http://www.w3.org/2000/svg">
  <g stroke="#111925" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="130" cy="292" rx="80" ry="16" fill="#89d7f7" stroke="none" opacity=".45"/>
    <path d="M79 196 C55 202 36 220 28 245 C24 257 38 263 49 255 L89 229" fill="#126f9f"/>
    <path d="M181 196 C206 202 224 222 232 246 C236 258 222 263 211 254 L171 229" fill="#126f9f"/>
    <ellipse cx="130" cy="173" rx="78" ry="93" fill="#0f77aa"/>
    <ellipse cx="130" cy="199" rx="53" ry="66" fill="#fffdf7" stroke="#d4e8ef" stroke-width="3"/>
    <path d="M103 143 C115 137 145 137 157 143 L160 165 C149 177 111 177 100 165Z" fill="#ff9a35"/>
    <path d="M122 154 C127 151 133 151 138 154 L137 166 C133 169 127 169 123 166Z" fill="#f47b22" stroke="none"/>
    <ellipse cx="99" cy="112" rx="35" ry="39" fill="#ff8d31"/>
    <ellipse cx="161" cy="112" rx="35" ry="39" fill="#ff8d31"/>
    <ellipse cx="99" cy="112" rx="23" ry="27" fill="#fffdf7" stroke="#111925" stroke-width="4"/>
    <ellipse cx="161" cy="112" rx="23" ry="27" fill="#fffdf7" stroke="#111925" stroke-width="4"/>
    <circle cx="104" cy="115" r="8" fill="#111925" stroke="none"/>
    <circle cx="156" cy="115" r="8" fill="#111925" stroke="none"/>
    <path d="M93 78 Q130 61 167 78 L178 50 Q170 22 130 19 Q90 22 82 50Z" fill="#ffd84d"/>
    <path d="M83 50 Q130 28 177 50 L174 70 Q130 53 86 70Z" fill="#f2bc26"/>
    <path d="M93 38 L104 29 M130 31 L130 21 M164 38 L155 29" fill="none" stroke="#d59b17"/>
    <path d="M78 76 Q74 57 87 43 M182 76 Q186 57 173 43" fill="none" stroke="#c58c12" stroke-width="7"/>
    <ellipse cx="130" cy="132" rx="12" ry="8" fill="#ff8d31" stroke="none"/>
    <path d="M123 130 Q130 137 137 130" fill="none" stroke="#111925" stroke-width="3"/>
    <path d="M93 255 Q105 274 119 285" fill="none" stroke="#ffbf27" stroke-width="17"/>
    <path d="M167 255 Q155 274 141 285" fill="none" stroke="#ffbf27" stroke-width="17"/>
    <path d="M99 284 Q111 278 124 286 L121 300 Q104 303 91 295Z" fill="#f49b20"/>
    <path d="M161 284 Q149 278 136 286 L139 300 Q156 303 169 295Z" fill="#f49b20"/>
    <path d="M70 206 Q56 199 48 185" fill="none" stroke="#0f77aa" stroke-width="16"/>
    <path d="M190 206 Q204 199 212 185" fill="none" stroke="#0f77aa" stroke-width="16"/>
  </g>
</svg>`;

const screens = ["home", "game", "tap", "letter", "gifts", "quiz", "secret", "final"];
const screenLabels = {
  home: "our milestone", game: "catch hearts", tap: "tap Pororo", letter: "a little note",
  gifts: "pick a gift", quiz: "couple quiz", secret: "secret zone", final: "the finale"
};
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const welcomeScreen = $("#welcomeScreen");
const experience = $("#experience");
const globalConfetti = $("#globalConfetti");
const toast = $("#toast");
let activeScreen = "home";
let toastTimeout;

// Populate every Pororo spot from the same lightweight inline illustration.
$$('.pororo-slot').forEach((slot) => { slot.innerHTML = PORORO_SVG; });

function storageRead(key) {
  try { return localStorage.getItem(key) || ""; } catch { return ""; }
}
function storageWrite(key, value) {
  try { localStorage.setItem(key, value); } catch { /* private browsing can disable storage */ }
}

function makeConfetti(amount = 25, target = globalConfetti) {
  if (!target) return;
  target.innerHTML = "";
  for (let i = 0; i < amount; i += 1) {
    const piece = document.createElement("i");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.setProperty("--fall", `${2.1 + Math.random() * 2.4}s`);
    piece.style.setProperty("--rotate", `${Math.round(Math.random() * 90 - 45)}deg`);
    piece.style.animationDelay = `${Math.random() * .7}s`;
    piece.style.width = `${5 + Math.random() * 6}px`;
    piece.style.height = `${8 + Math.random() * 10}px`;
    target.appendChild(piece);
  }
  window.setTimeout(() => { target.innerHTML = ""; }, 5200);
}

function showToast(text, icon = "✦") {
  $("#toastText").textContent = text;
  $("#toastIcon").textContent = icon;
  toast.classList.add("is-visible");
  clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function buildJourneyDots() {
  const dots = $("#journeyDots");
  dots.innerHTML = screens.map((name, index) => `<button class="journey-dot${index === 0 ? " is-active" : ""}" type="button" data-go="${name}" aria-label="Buka ${screenLabels[name]}" title="${screenLabels[name]}"></button>`).join("");
}

function updateProgress() {
  const index = screens.indexOf(activeScreen);
  $("#sectionCounter").textContent = `${String(index + 1).padStart(2, "0")} / ${String(screens.length).padStart(2, "0")}`;
  $("#progressFill").style.width = `${((index + 1) / screens.length) * 100}%`;
  $("#journeyLabel").textContent = screenLabels[activeScreen];
  $$(".journey-dot").forEach((dot) => dot.classList.toggle("is-active", dot.dataset.go === activeScreen));
}

function showScreen(name, options = {}) {
  if (!screens.includes(name)) return;
  activeScreen = name;
  $$(".screen").forEach((screen) => {
    const isCurrent = screen.dataset.screen === name;
    screen.hidden = !isCurrent;
    screen.classList.toggle("is-active", isCurrent);
  });
  updateProgress();
  document.body.dataset.screen = name;
  if (name === "home" || name === "final" || options.confetti) {
    makeConfetti(name === "final" ? 55 : 26, name === "final" ? $("#finalConfetti") : globalConfetti);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

buildJourneyDots();
updateProgress();

$("#enterButton").addEventListener("click", () => {
  welcomeScreen.hidden = true;
  experience.hidden = false;
  showScreen("home", { confetti: true });
  tryPlayMusic();
});

$$("[data-go]").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.go));
});
$$("[data-next]").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.next));
});

// Editable anniversary date.
const savedDate = storageRead("silvaAnniversaryDate");
const configuredDate = CONFIG.anniversaryDate.trim();
let anniversaryDate = savedDate || configuredDate;
function renderDate() {
  $("#dateDisplay").textContent = anniversaryDate || "isi tanggalnya di sini ✎";
  $("#dateHint").textContent = anniversaryDate ? "tanggalnya tersimpan di browser ini. klik pensil kalau mau ganti." : "tanggalnya boleh diedit kapan aja, karena aku nggak mau ngarang tanggal hehe.";
}
renderDate();
const dateModal = $("#dateModal");
function closeDateModal() { dateModal.hidden = true; }
$("#editDateButton").addEventListener("click", () => {
  $("#dateInput").value = anniversaryDate;
  dateModal.hidden = false;
  window.setTimeout(() => $("#dateInput").focus(), 80);
});
$("#closeDateButton").addEventListener("click", closeDateModal);
$("#cancelDateButton").addEventListener("click", closeDateModal);
$("#saveDateButton").addEventListener("click", () => {
  anniversaryDate = $("#dateInput").value.trim();
  storageWrite("silvaAnniversaryDate", anniversaryDate);
  renderDate();
  closeDateModal();
  showToast(anniversaryDate ? "tanggal anniversary sudah disimpan!" : "tanggal dikosongkan lagi.", "✓");
});

// Catch the Hearts mini game.
let gameScore = 0;
let gameTime = 20;
let gameTimerInterval = null;
let gameSpawnInterval = null;
let gameRunning = false;
const gameBoard = $("#gameBoard");
function updateGameHud() {
  $("#gameScore").textContent = String(gameScore).padStart(2, "0");
  $("#gameTimer").textContent = String(gameTime).padStart(2, "0");
}
function clearGameIntervals() {
  clearInterval(gameTimerInterval);
  clearInterval(gameSpawnInterval);
  gameTimerInterval = null;
  gameSpawnInterval = null;
}
function clearHearts() { $$(".game-heart", gameBoard).forEach((heart) => heart.remove()); }
function spawnHeart() {
  if (!gameRunning) return;
  const heart = document.createElement("button");
  heart.type = "button";
  heart.className = "game-heart";
  heart.textContent = "♥";
  heart.setAttribute("aria-label", "Tangkap hati biru");
  const boardWidth = Math.max(250, gameBoard.clientWidth - 58);
  const boardHeight = Math.max(220, gameBoard.clientHeight - 80);
  heart.style.left = `${12 + Math.random() * Math.max(20, boardWidth - 24)}px`;
  heart.style.top = `${25 + Math.random() * Math.max(20, boardHeight - 25)}px`;
  heart.addEventListener("click", () => {
    if (!gameRunning) return;
    gameScore += 1;
    updateGameHud();
    heart.remove();
    if (gameScore >= 8) endGame(true);
  }, { once: true });
  gameBoard.appendChild(heart);
  window.setTimeout(() => heart.remove(), 2100);
}
function startGame() {
  clearGameIntervals();
  clearHearts();
  gameRunning = true;
  gameScore = 0;
  gameTime = 20;
  updateGameHud();
  $("#gameStartState").hidden = true;
  $("#gameResult").hidden = true;
  gameSpawnInterval = setInterval(spawnHeart, 650);
  gameTimerInterval = setInterval(() => {
    gameTime -= 1;
    updateGameHud();
    if (gameTime <= 0) endGame(gameScore >= 8);
  }, 1000);
  spawnHeart();
}
function endGame(won) {
  if (!gameRunning) return;
  gameRunning = false;
  clearGameIntervals();
  clearHearts();
  $("#gameResult").hidden = false;
  $("#gameResultTitle").textContent = won ? "you got them!" : "cute try, Silva!";
  $("#gameResultText").textContent = won ? "semua hati birunya aman. Pororo bangga banget!" : `kamu dapat ${gameScore} hati — ayo coba lagi kalau mau pecahin target 08.`;
  if (won) makeConfetti(24);
}
$("#startGameButton").addEventListener("click", startGame);
$("#restartGameButton").addEventListener("click", startGame);

// Tap Pororo reactions.
const reactions = [
  { text: "halo Silvaaa! jangan lupa senyum hari ini 💙", className: "is-waving" },
  { text: "aku tahu satu rahasia: kamu lucu banget.", className: "is-bouncing" },
  { text: "high five dulu! happy 2 months!", className: "is-waving" },
  { text: "ini hati biru khusus buat kamu ♡", className: "is-heartburst" },
  { text: "makasih udah jadi rumah yang seru.", className: "is-bouncing" }
];
let tapCount = 0;
let reactionIndex = 0;
$("#pororoButton").addEventListener("click", () => {
  const stage = $("#pororoStage");
  const reaction = reactions[reactionIndex % reactions.length];
  reactionIndex += 1;
  tapCount += 1;
  $("#reactionText").textContent = reaction.text;
  $("#tapCount").textContent = `taps: ${tapCount}`;
  stage.classList.remove("is-waving", "is-bouncing", "is-heartburst");
  void stage.offsetWidth;
  stage.classList.add(reaction.className);
  window.setTimeout(() => stage.classList.remove(reaction.className), 700);
});

// Love letter envelope.
$("#envelopeButton").addEventListener("click", () => {
  const button = $("#envelopeButton");
  const isOpen = button.classList.toggle("is-open");
  button.setAttribute("aria-expanded", String(isOpen));
  $("#letterCard").hidden = !isOpen;
  if (isOpen) {
    showToast("surat kecilnya kebuka!", "♡");
    window.setTimeout(() => $("#letterCard").scrollIntoView({ behavior: "smooth", block: "center" }), 120);
  }
});
$("#closeLetterButton").addEventListener("click", () => {
  $("#letterCard").hidden = true;
  $("#envelopeButton").classList.remove("is-open");
  $("#envelopeButton").setAttribute("aria-expanded", "false");
});

// Three distinct gifts.
const giftResults = {
  1: { icon: "♡", title: "a tiny reminder", text: "kalau hari kamu lagi berat, sini deh — kamu nggak perlu melewatinya sendirian. aku ada.", magic: false },
  2: { icon: "✦", title: "blue magic unlocked!", text: "♥ ♥ ♥ Pororo baru aja mengirim tiga peluk biru dari sini ke kamu! ♥ ♥ ♥", magic: true },
  3: { icon: "✉", title: "secret mini mail", text: "psst... kalau aku boleh pilih lagi, aku tetap bakal pilih kamu. tiap hari, versi yang sama-sama lucu.", magic: false }
};
$$("[data-gift]").forEach((gift) => gift.addEventListener("click", () => {
  const result = giftResults[gift.dataset.gift];
  const resultBox = $("#giftResult");
  $(".gift-result-icon", resultBox).textContent = result.icon;
  $(".gift-result", document).querySelector("strong").textContent = result.title;
  $(".gift-result", document).querySelector("span:last-child").textContent = result.text;
  resultBox.classList.remove("is-magic");
  void resultBox.offsetWidth;
  if (result.magic) {
    resultBox.classList.add("is-magic");
    makeConfetti(20);
  }
  showToast(`gift ${gift.dataset.gift} kebuka!`, result.icon);
}));

// Editable-feeling couple quiz.
let quizIndex = 0;
let quizScore = 0;
let quizSelected = null;
const quizOptions = $("#quizOptions");
function renderQuiz() {
  const current = CONFIG.quiz[quizIndex];
  $("#quizCard").hidden = false;
  $("#quizResultCard").hidden = true;
  $("#questionNumber").textContent = `Q${quizIndex + 1}`;
  $("#questionText").textContent = current.question;
  $("#quizCounter").textContent = `${String(quizIndex + 1).padStart(2, "0")} / ${String(CONFIG.quiz.length).padStart(2, "0")}`;
  quizOptions.innerHTML = "";
  quizSelected = null;
  $("#quizNextButton").disabled = true;
  $("#quizNextButton").innerHTML = quizIndex === CONFIG.quiz.length - 1 ? "lihat hasil <span>✦</span>" : "next question <span>→</span>";
  current.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    button.textContent = option;
    button.addEventListener("click", () => {
      quizSelected = index;
      $$(".quiz-option", quizOptions).forEach((item) => item.classList.remove("is-selected"));
      button.classList.add("is-selected");
      $("#quizNextButton").disabled = false;
    });
    quizOptions.appendChild(button);
  });
}
function showQuizResult() {
  $("#quizCard").hidden = true;
  $("#quizResultCard").hidden = false;
  $("#quizResultTitle").textContent = quizScore >= Math.ceil(CONFIG.quiz.length / 2) ? "you two are a perfect little team!" : "still a very cute team!";
  $("#quizResultText").textContent = `skor kamu ${quizScore}/${CONFIG.quiz.length}. yang penting bukan jawabannya selalu sama, tapi kamu masih pilih kita hehe.`;
}
$("#quizNextButton").addEventListener("click", () => {
  if (quizSelected === null) return;
  if (quizSelected === CONFIG.quiz[quizIndex].correct) quizScore += 1;
  quizIndex += 1;
  if (quizIndex >= CONFIG.quiz.length) showQuizResult();
  else renderQuiz();
});
$("#quizRestartButton").addEventListener("click", () => { quizIndex = 0; quizScore = 0; renderQuiz(); });
renderQuiz();

// Secret message.
$("#secretButton").addEventListener("click", () => {
  const card = $("#secretCard");
  const willOpen = card.hidden;
  card.hidden = !willOpen;
  if (willOpen) {
    makeConfetti(22);
    showToast("secret message unlocked!", "♡");
  }
});

$("#playAgainButton").addEventListener("click", () => {
  clearGameIntervals();
  clearHearts();
  gameRunning = false;
  $("#gameStartState").hidden = false;
  $("#gameResult").hidden = true;
  $("#letterCard").hidden = true;
  $("#envelopeButton").classList.remove("is-open");
  $("#secretCard").hidden = true;
  renderQuiz();
  showScreen("home", { confetti: true });
});

// Official music embed: no audio file is downloaded or hosted here.
let ytPlayer = null;
let ytReady = false;
let musicIsPlaying = false;
window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player("youtubePlayer", {
    height: "1",
    width: "1",
    videoId: CONFIG.musicVideoId,
    playerVars: { autoplay: 1, controls: 0, loop: 1, playlist: CONFIG.musicVideoId, modestbranding: 1, rel: 0, playsinline: 1 },
    events: {
      onReady: (event) => {
        ytReady = true;
        event.target.setVolume(Number($("#volumeSlider").value));
        tryPlayMusic();
      },
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.PLAYING) setMusicState(true);
        if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) setMusicState(false);
      }
    }
  });
};
function setMusicState(playing) {
  musicIsPlaying = playing;
  $("#musicStatus").textContent = playing ? "playing" : "our song";
  $("#musicPlayButton").innerHTML = playing ? "❚❚ pause our song" : "▶ play our song";
  $(".music-bars").classList.toggle("is-paused", !playing);
  $(".sound-wave").classList.toggle("is-on", playing);
}
function tryPlayMusic() {
  if (!ytReady || !ytPlayer) return;
  try {
    ytPlayer.playVideo();
  } catch {
    setMusicState(false);
  }
}
$("#musicPill").addEventListener("click", () => { $("#musicModal").hidden = false; });
$("#closeMusicButton").addEventListener("click", () => { $("#musicModal").hidden = true; });
$("#musicPlayButton").addEventListener("click", () => {
  if (!ytReady || !ytPlayer) {
    showToast("music player lagi loading, coba sebentar lagi ya.", "♫");
    return;
  }
  if (musicIsPlaying) ytPlayer.pauseVideo();
  else { ytPlayer.unMute(); ytPlayer.playVideo(); }
});
$("#volumeSlider").addEventListener("input", (event) => {
  const value = Number(event.target.value);
  $("#volumeOutput").textContent = `${value}%`;
  if (ytReady && ytPlayer) ytPlayer.setVolume(value);
});

// Close modal surfaces when tapping the dimmed background.
[dateModal, $("#musicModal")].forEach((modal) => modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.hidden = true;
}));
