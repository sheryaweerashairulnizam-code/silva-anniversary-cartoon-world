(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const screenOrder = ['intro', 'anniversary', 'story', 'letter', 'map', 'love', 'quiz', 'box', 'final'];
  const screens = Object.fromEntries(screenOrder.map((id) => [id, $(`#screen-${id}`)]));
  const chrome = $('#siteChrome');
  const chapterNav = $('#chapterNav');
  const editModeButton = $('#editModeButton');
  const musicButton = $('#musicButton');
  const editTip = $('#editTip');
  let currentScreen = 'intro';
  let editMode = false;
  let editTipTimer;

  function showScreen(id, options = {}) {
    if (!screens[id]) return;
    const previous = currentScreen;
    currentScreen = id;

    Object.entries(screens).forEach(([screenId, panel]) => {
      const isActive = screenId === id;
      panel.hidden = !isActive;
      panel.classList.toggle('active', isActive);
      panel.setAttribute('aria-hidden', String(!isActive));
    });

    const isIntro = id === 'intro';
    chrome.classList.toggle('is-hidden', isIntro);
    chapterNav.hidden = isIntro;
    $$('.nav-dot').forEach((dot) => dot.classList.toggle('active', dot.dataset.go === id));

    if (!isIntro && previous === 'intro') window.scrollTo({ top: 0, behavior: 'smooth' });
    else if (options.scroll !== false) window.scrollTo({ top: 0, behavior: 'smooth' });

    if (id === 'story') updateStory();
    if (id === 'quiz') resetQuiz();
    if (id === 'final') window.setTimeout(() => $('.final-copy')?.focus?.(), 80);
  }

  $$('[data-go]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const id = button.dataset.go;
      if (!id) return;
      event.preventDefault();
      showScreen(id);
    });
  });

  // Start in a clean intro state; the chrome appears after the first gesture.
  showScreen('intro', { scroll: false });

  // Editable copy: turn it on only from the small edit control, and persist browser-local changes.
  const editableNodes = $$('[data-editable="true"]');
  editableNodes.forEach((node, index) => {
    const key = `silva-story-edit-${index}`;
    node.dataset.editKey = key;
    const saved = localStorage.getItem(key);
    if (saved) node.innerHTML = saved;
    node.setAttribute('contenteditable', 'false');
    node.addEventListener('input', () => {
      if (editMode) localStorage.setItem(key, node.innerHTML);
    });
  });

  function setEditMode(nextValue) {
    editMode = nextValue;
    document.body.classList.toggle('edit-mode', editMode);
    editModeButton.setAttribute('aria-pressed', String(editMode));
    editModeButton.innerHTML = editMode ? '<span aria-hidden="true">✓</span> Simpan teks' : '<span aria-hidden="true">✎</span> Edit teks';
    editableNodes.forEach((node) => node.setAttribute('contenteditable', String(editMode)));
    editTip.classList.toggle('show', editMode);
    clearTimeout(editTipTimer);
    if (editMode) editTipTimer = window.setTimeout(() => editTip.classList.remove('show'), 4300);
  }

  editModeButton.addEventListener('click', () => setEditMode(!editMode));
  $('#finalEditButton').addEventListener('click', () => {
    showScreen('final');
    setEditMode(true);
    window.setTimeout(() => $('.final-message')?.focus(), 350);
  });

  // The date is intentionally blank until the couple chooses it.
  const dateInput = $('#anniversaryDate');
  const savedDate = localStorage.getItem('silva-story-anniversary-date');
  if (savedDate) dateInput.value = savedDate;
  dateInput.addEventListener('change', () => localStorage.setItem('silva-story-anniversary-date', dateInput.value));

  // Optional local photo — no stock or stranger photos are inserted.
  $('#photoInput').addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const preview = $('#photoPreview');
      preview.classList.add('has-photo');
      preview.style.backgroundImage = `url(${reader.result})`;
      preview.setAttribute('aria-label', 'Foto yang dipilih');
    });
    reader.readAsDataURL(file);
  });

  // Story chapters.
  const storyData = [
    {
      title: 'Episode 01: Salju turun!',
      text: 'Di sebuah negeri biru, seorang penguin kecil sedang menghitung kepingan salju yang jatuh satu-satu.'
    },
    {
      title: 'Episode 02: Dari balik kastil',
      text: 'Jauh di sisi lain, seorang gadis kecil bergaya gothic mendengar suara ceria dari balik malam. Ia pun menoleh.'
    },
    {
      title: 'Episode 03: Pintu di tengah-tengah',
      text: 'Sebuah pintu ajaib muncul di tempat dua warna bertemu. Tidak ada yang tahu siapa yang membangunnya—tapi keduanya berani mengetuk.'
    },
    {
      title: 'Episode 04: Dunia kami',
      text: 'Sejak hari itu, biru dan maroon tidak lagi berjauhan. Mereka menciptakan dunia kecil yang hangat, lucu, dan selalu punya ruang untuk dua hati.'
    }
  ];
  let storyIndex = 0;
  const storyOverrides = storyData.map((story, index) => localStorage.getItem(`silva-story-scene-${index}`) || story.text);
  const storyScenes = $$('.story-scene');
  const storyTitle = $('#storyTitle');
  const storyText = $('#storyText');
  const storyCounter = $('#storyCounter');
  const storyProgressBar = $('#storyProgressBar');
  const storyNext = $('#storyNext');

  function updateStory() {
    const story = storyData[storyIndex];
    storyScenes.forEach((scene, index) => scene.classList.toggle('active', index === storyIndex));
    storyTitle.textContent = story.title;
    storyText.innerHTML = storyOverrides[storyIndex];
    storyCounter.textContent = `${String(storyIndex + 1).padStart(2, '0')} / 04`;
    storyProgressBar.style.width = `${((storyIndex + 1) / storyData.length) * 100}%`;
    storyNext.innerHTML = storyIndex === storyData.length - 1 ? 'Buka surat rahasia <span>→</span>' : 'Lanjut cerita <span>→</span>';
  }

  storyText.addEventListener('input', () => {
    if (!editMode) return;
    storyOverrides[storyIndex] = storyText.innerHTML;
    localStorage.setItem(`silva-story-scene-${storyIndex}`, storyText.innerHTML);
  });

  storyNext.addEventListener('click', () => {
    if (storyIndex < storyData.length - 1) {
      storyIndex += 1;
      updateStory();
      return;
    }
    showScreen('letter');
  });

  // Envelope reveal.
  const envelopeButton = $('#envelopeButton');
  const letterPaper = $('#letterPaper');
  envelopeButton.addEventListener('click', () => {
    const isOpen = letterPaper.classList.toggle('is-open');
    envelopeButton.setAttribute('aria-expanded', String(isOpen));
    letterPaper.setAttribute('aria-hidden', String(!isOpen));
    envelopeButton.setAttribute('aria-label', isOpen ? 'Tutup surat rahasia' : 'Buka surat rahasia');
  });

  // Map messages.
  const mapMessageCard = $('.map-message-card');
  const mapMessage = $('#mapMessage');
  const mapMessageTitle = $('#mapMessageTitle');
  const mapMessageIcon = $('#mapMessageIcon');
  $$('.map-location').forEach((location) => {
    location.addEventListener('click', () => {
      $$('.map-location').forEach((item) => item.classList.remove('is-selected'));
      location.classList.add('is-selected');
      mapMessage.textContent = location.dataset.mapMessage;
      mapMessageTitle.textContent = location.querySelector('small').textContent;
      mapMessageIcon.textContent = location.textContent.trim().startsWith('❄') ? '❄' : location.textContent.trim().startsWith('✦') ? '✦' : '♡';
      mapMessageCard.classList.remove('is-flashed');
      void mapMessageCard.offsetWidth;
      mapMessageCard.classList.add('is-flashed');
    });
  });

  // Flip cards.
  $$('.flip-card').forEach((card) => {
    const flip = () => {
      if (editMode && document.activeElement?.isContentEditable) return;
      const flipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', String(flipped));
    };
    card.addEventListener('click', (event) => {
      if (event.target.closest('[contenteditable="true"]')) return;
      flip();
    });
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        flip();
      }
    });
  });

  // Couple quiz.
  const quizData = [
    { question: 'Siapa yang suka biru?', options: ['Silva!', 'Aku!', 'Kucing tetangga!'], answer: 'Silva!', good: 'Betul! Biru cerah itu memang wilayah Silva. ❄' },
    { question: 'Siapa yang suka maroon dan gothic?', options: ['Silva!', 'Aku!', 'Dua-duanya!'], answer: 'Aku!', good: 'Yup, maroon + gothic adalah side-ku. ✦' },
    { question: 'Siapa yang paling spesial di cerita ini?', options: ['Silva!', 'Aku!', 'KAMI BERDUA!'], answer: 'KAMI BERDUA!', good: 'Jawaban terbaik! Cerita ini memang milik kita berdua. ♡' }
  ];
  let quizIndex = 0;
  let quizScore = 0;
  let quizAnswered = false;
  const quizQuestion = $('#quizQuestion');
  const quizOptions = $('#quizOptions');
  const quizFeedback = $('#quizFeedback');
  const quizNext = $('#quizNext');
  const quizStep = $('#quizStep');
  const quizScoreLabel = $('#quizScore');

  function renderQuiz() {
    const current = quizData[quizIndex];
    quizAnswered = false;
    quizQuestion.textContent = current.question;
    quizStep.textContent = `pertanyaan ${quizIndex + 1} dari ${quizData.length}`;
    quizScoreLabel.textContent = `♡ ${quizScore} benar`;
    quizFeedback.textContent = '';
    quizFeedback.className = 'quiz-feedback';
    quizNext.disabled = true;
    quizNext.innerHTML = quizIndex === quizData.length - 1 ? 'Buka secret box <span>→</span>' : 'Lanjut pertanyaan <span>→</span>';
    quizOptions.innerHTML = '';
    current.options.forEach((option) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'quiz-option';
      button.textContent = option;
      button.addEventListener('click', () => answerQuiz(button, option, current));
      quizOptions.appendChild(button);
    });
  }

  function answerQuiz(clickedButton, option, current) {
    if (quizAnswered) return;
    quizAnswered = true;
    const isCorrect = option === current.answer;
    $$('.quiz-option', quizOptions).forEach((button) => {
      button.disabled = true;
      if (button.textContent === current.answer) button.classList.add('is-correct');
    });
    if (isCorrect) {
      quizScore += 1;
      clickedButton.classList.add('is-correct');
      quizFeedback.textContent = current.good;
      quizFeedback.classList.add('good');
    } else {
      clickedButton.classList.add('is-wrong');
      quizFeedback.textContent = `Hampir! Jawaban manisnya: ${current.answer} ${current.answer === 'KAMI BERDUA!' ? '♡' : '✦'}`;
      quizFeedback.classList.add('bad');
    }
    quizScoreLabel.textContent = `♡ ${quizScore} benar`;
    quizNext.disabled = false;
  }

  function resetQuiz() {
    quizIndex = 0;
    quizScore = 0;
    renderQuiz();
  }

  quizNext.addEventListener('click', () => {
    if (!quizAnswered) return;
    if (quizIndex < quizData.length - 1) {
      quizIndex += 1;
      renderQuiz();
    } else {
      showScreen('box');
    }
  });

  // Secret box.
  const treasureBox = $('#treasureBox');
  const treasureArea = $('.treasure-area');
  treasureBox.addEventListener('click', () => {
    const isOpen = treasureArea.classList.toggle('is-open');
    treasureBox.classList.toggle('is-open', isOpen);
    treasureBox.setAttribute('aria-expanded', String(isOpen));
  });

  // Restart the experience without erasing the couple's local edits.
  $('#replayButton').addEventListener('click', () => {
    storyIndex = 0;
    updateStory();
    letterPaper.classList.remove('is-open');
    envelopeButton.setAttribute('aria-expanded', 'false');
    letterPaper.setAttribute('aria-hidden', 'true');
    treasureArea.classList.remove('is-open');
    treasureBox.classList.remove('is-open');
    treasureBox.setAttribute('aria-expanded', 'false');
    $$('.flip-card').forEach((card) => {
      card.classList.remove('is-flipped');
      card.setAttribute('aria-pressed', 'false');
    });
    showScreen('intro');
  });

  // Optional music: only begins after an explicit click, using a tiny local Web Audio loop.
  let audioContext;
  let musicTimer;
  let musicStep = 0;
  const notes = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23];

  function playNote(frequency) {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.035, audioContext.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.48);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  }

  async function toggleMusic() {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') await audioContext.resume();
    const isPlaying = musicButton.getAttribute('aria-pressed') === 'true';
    if (isPlaying) {
      clearInterval(musicTimer);
      musicButton.setAttribute('aria-pressed', 'false');
      musicButton.innerHTML = '<span aria-hidden="true">♫</span> Musik off';
      return;
    }
    musicButton.setAttribute('aria-pressed', 'true');
    musicButton.innerHTML = '<span aria-hidden="true">♫</span> Musik on';
    playNote(notes[musicStep % notes.length]);
    musicStep += 1;
    musicTimer = window.setInterval(() => {
      playNote(notes[musicStep % notes.length]);
      musicStep += 1;
    }, 620);
  }

  musicButton.addEventListener('click', toggleMusic);

  // Keep the primary button keyboard-friendly in browsers that support hash navigation.
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && editMode) setEditMode(false);
  });
})();
