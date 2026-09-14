(() => {
  'use strict';

  const STORAGE_KEY = 'snpp-training-state-v1';
  const STATE_VERSION = 1;
  const VIEW_META = {
    dashboard: ['Pregătire pentru proba scrisă', 'Panou de antrenament'],
    training: ['Grile cu răspuns unic', 'Antrenament'],
    curriculum: ['Tematica furnizată pentru admitere', 'Tematică și bibliografie'],
    progress: ['Statistici salvate local', 'Progres'],
    settings: ['Configurare locală', 'Setări']
  };

  const SUBJECTS = {
    romana: { label: 'Limba română' },
    istorie: { label: 'Istoria românilor' }
  };

  const TOPICS = {
    romana: [
      ['vocabular', 'Vocabularul'],
      ['fonetica', 'Noțiuni de fonetică'],
      ['morfosintaxa', 'Morfosintaxa'],
      ['sintaxa', 'Noțiuni de sintaxă']
    ],
    istorie: [
      ['constitutii', 'Constituțiile din România'],
      ['autonomii-institutii', 'Autonomii locale și instituții centrale'],
      ['stat-modern', 'Statul român modern'],
      ['romania-postbelica', 'România postbelică'],
      ['diplomatie-conflict', 'Diplomație și conflict'],
      ['concert-european', 'România și concertul european']
    ]
  };

  const defaultState = () => ({
    version: STATE_VERSION,
    theme: 'system',
    answers: {},
    sessions: [],
    updatedAt: new Date().toISOString()
  });

  let state = loadState();
  let questionBank = [];
  let selectedMode = 'practice';
  let activeSession = null;
  let lastSessionConfig = null;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      if (!isValidState(parsed)) throw new Error('Schema invalidă');
      return parsed;
    } catch (error) {
      console.warn('Progresul local nu a putut fi citit. Se folosește o stare nouă.', error);
      return defaultState();
    }
  }

  function isValidState(value) {
    if (!value || typeof value !== 'object' || value.version !== STATE_VERSION) return false;
    if (!['system', 'light', 'dark'].includes(value.theme)) return false;
    if (!value.answers || typeof value.answers !== 'object' || Array.isArray(value.answers)) return false;
    if (!Array.isArray(value.sessions)) return false;
    return true;
  }

  function saveState() {
    state.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Nu s-a putut salva progresul.', error);
      toast('Progresul nu a putut fi salvat în acest browser.', true);
    }
  }

  function validateQuestionBank(bank) {
    const errors = [];
    const ids = new Set();
    if (!Array.isArray(bank)) return { valid: false, errors: ['QUESTION_BANK trebuie să fie un array.'] };

    bank.forEach((q, index) => {
      const prefix = `Întrebarea #${index + 1}`;
      if (!q || typeof q !== 'object') { errors.push(`${prefix}: structură invalidă.`); return; }
      if (typeof q.id !== 'string' || !/^\d{4}-(?:ro|ist)-\d{3}$/.test(q.id)) errors.push(`${prefix}: id invalid.`);
      else if (ids.has(q.id)) errors.push(`${prefix}: id duplicat „${q.id}”.`);
      else ids.add(q.id);
      if (!SUBJECTS[q.subject]) errors.push(`${prefix}: materia „${q.subject ?? ''}” nu este validă.`);
      const validTopics = TOPICS[q.subject]?.map(([key]) => key) ?? [];
      if (!validTopics.includes(q.topic)) errors.push(`${prefix}: tema „${q.topic ?? ''}” nu este validă pentru materie.`);
      if (typeof q.prompt !== 'string' || !q.prompt.trim()) errors.push(`${prefix}: enunț lipsă.`);
      if (!Array.isArray(q.options) || q.options.length !== 4 || q.options.some(o => typeof o !== 'string' || !o.trim())) errors.push(`${prefix}: trebuie să existe exact patru opțiuni text valide.`);
      if (!Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex > 3) errors.push(`${prefix}: correctIndex este invalid.`);
      if (q.explanation != null && typeof q.explanation !== 'string') errors.push(`${prefix}: explanation trebuie să fie text.`);
      if (q.source != null && typeof q.source !== 'string') errors.push(`${prefix}: source trebuie să fie text.`);
    });

    return { valid: errors.length === 0, errors };
  }

  function reloadQuestionBank() {
    const candidate = Array.isArray(window.QUESTION_BANK) ? window.QUESTION_BANK : [];
    const validation = validateQuestionBank(candidate);
    if (!validation.valid) {
      console.error('Banca de grile conține erori:', validation.errors);
      questionBank = [];
      toast(`Banca de grile are ${validation.errors.length} eroare/erori de structură.`, true);
    } else {
      questionBank = candidate.map(q => ({ ...q, options: [...q.options] }));
    }
    updateAllUI();
    return validation;
  }

  function setView(view, { focus = true } = {}) {
    if (!VIEW_META[view]) return;
    $$('[data-view-panel]').forEach(panel => {
      const active = panel.dataset.viewPanel === view;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
    $$('[data-view]').forEach(button => {
      const active = button.dataset.view === view;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
    });
    $('#view-eyebrow').textContent = VIEW_META[view][0];
    $('#view-title').textContent = VIEW_META[view][1];
    history.replaceState(null, '', `#${view}`);
    if (view === 'progress') renderProgress();
    if (view === 'training') updateTrainingAvailability();
    if (focus) $('#main-content').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function applyTheme(theme) {
    const safeTheme = ['system', 'light', 'dark'].includes(theme) ? theme : 'system';
    document.documentElement.dataset.theme = safeTheme;
    state.theme = safeTheme;
    $$('[data-theme-choice]').forEach(button => {
      const active = button.dataset.themeChoice === safeTheme;
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-checked', String(active));
    });
    saveState();
  }

  function cycleTheme() {
    const order = ['system', 'light', 'dark'];
    applyTheme(order[(order.indexOf(state.theme) + 1) % order.length]);
    toast(`Temă: ${state.theme === 'system' ? 'sistem' : state.theme === 'light' ? 'luminos' : 'întunecat'}.`);
  }

  function getTopicLabel(subject, topic) {
    return TOPICS[subject]?.find(([key]) => key === topic)?.[1] ?? topic;
  }

  function getQuestionStats(id) {
    const record = state.answers[id];
    if (!record) return { attempts: 0, correct: 0, lastCorrect: null };
    return {
      attempts: Number(record.attempts) || 0,
      correct: Number(record.correct) || 0,
      lastCorrect: typeof record.lastCorrect === 'boolean' ? record.lastCorrect : null
    };
  }

  function aggregateStats() {
    let answered = 0;
    let correct = 0;
    let mistakes = 0;
    const bySubject = { romana: { answered: 0, correct: 0 }, istorie: { answered: 0, correct: 0 } };

    Object.entries(state.answers).forEach(([id, record]) => {
      const question = questionBank.find(q => q.id === id);
      if (!question) return;
      const stats = getQuestionStats(id);
      answered += stats.attempts;
      correct += stats.correct;
      if (stats.lastCorrect === false) mistakes += 1;
      bySubject[question.subject].answered += stats.attempts;
      bySubject[question.subject].correct += stats.correct;
    });

    return { answered, correct, mistakes, bySubject };
  }

  function percent(numerator, denominator) {
    return denominator ? Math.round((numerator / denominator) * 100) : 0;
  }

  function updateDashboard() {
    const stats = aggregateStats();
    const overall = percent(stats.correct, stats.answered);
    $('#overall-percent').textContent = `${overall}%`;
    $('#overall-ring').style.setProperty('--score', `${overall * 3.6}deg`);
    $('#overall-caption').textContent = stats.answered ? `${stats.correct} corecte din ${stats.answered} răspunsuri` : 'Nicio grilă rezolvată încă';
    $('#stat-answered').textContent = String(stats.answered);
    $('#stat-correct').textContent = String(stats.correct);
    $('#stat-sessions').textContent = String(state.sessions.length);
    $('#stat-bank').textContent = String(questionBank.length);

    ['romana', 'istorie'].forEach(subject => {
      const available = questionBank.filter(q => q.subject === subject).length;
      const subjectStats = stats.bySubject[subject];
      const ratio = percent(subjectStats.correct, subjectStats.answered);
      const prefix = subject === 'romana' ? 'romanian' : 'history';
      $(`#${prefix}-meta`).textContent = `${available} grile disponibile · ${ratio}% corecte`;
      $(`#${prefix}-progress`).style.width = `${ratio}%`;
    });
  }

  function updateTrainingAvailability() {
    updateTopicFilter();
    const pool = getFilteredPool({ respectCount: false });
    const start = $('#start-session');
    $('#bank-count').textContent = String(questionBank.length);
    if (!questionBank.length) {
      $('#availability-title').textContent = 'Banca de grile nu este încă încărcată.';
      $('#availability-text').textContent = 'Adaugă întrebări validate în js/questions.js pentru a activa antrenamentul.';
      start.disabled = true;
      return;
    }
    if (!pool.length) {
      $('#availability-title').textContent = selectedMode === 'mistakes' ? 'Nu există greșeli pentru filtrele alese.' : 'Nu există grile pentru filtrele alese.';
      $('#availability-text').textContent = selectedMode === 'mistakes' ? 'Rezolvă întâi câteva întrebări și revino aici.' : 'Schimbă materia sau tema.';
      start.disabled = true;
      return;
    }
    $('#availability-title').textContent = `${pool.length} grile corespund filtrelor.`;
    $('#availability-text').textContent = selectedMode === 'practice' ? 'Vei primi feedback după fiecare răspuns.' : selectedMode === 'test' ? 'Răspunsurile vor fi evaluate la final.' : 'Sunt incluse numai întrebările greșite ultima dată.';
    start.disabled = false;
  }

  function updateTopicFilter() {
    const subject = $('#subject-filter').value;
    const select = $('#topic-filter');
    const previous = select.value;
    const topicPairs = subject === 'all' ? [...TOPICS.romana, ...TOPICS.istorie] : (TOPICS[subject] ?? []);
    const unique = [...new Map(topicPairs.map(item => [item[0], item])).values()];
    select.innerHTML = '<option value="all">Toate temele</option>' + unique.map(([key, label]) => `<option value="${key}">${label}</option>`).join('');
    if ([...select.options].some(option => option.value === previous)) select.value = previous;
  }

  function getFilteredPool({ respectCount = true } = {}) {
    const subject = $('#subject-filter').value;
    const topic = $('#topic-filter').value;
    let pool = [...questionBank];
    if (subject !== 'all') pool = pool.filter(q => q.subject === subject);
    if (topic !== 'all') pool = pool.filter(q => q.topic === topic);
    if (selectedMode === 'mistakes') pool = pool.filter(q => getQuestionStats(q.id).lastCorrect === false);
    pool = shuffle(pool);
    if (respectCount) {
      const requested = $('#count-filter').value;
      if (requested !== 'all') pool = pool.slice(0, Number(requested));
    }
    return pool;
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function startSession(config = null) {
    const pool = config?.questions ? [...config.questions] : getFilteredPool();
    if (!pool.length) return;
    activeSession = {
      mode: config?.mode ?? selectedMode,
      questions: pool,
      index: 0,
      answers: [],
      correct: 0,
      answeredCurrent: false,
      startedAt: new Date().toISOString()
    };
    lastSessionConfig = {
      mode: activeSession.mode,
      subject: $('#subject-filter').value,
      topic: $('#topic-filter').value,
      count: $('#count-filter').value
    };
    $('#training-setup').hidden = true;
    $('#quiz-results').hidden = true;
    $('#quiz-runner').hidden = false;
    renderCurrentQuestion();
  }

  function renderCurrentQuestion() {
    if (!activeSession) return;
    const q = activeSession.questions[activeSession.index];
    activeSession.answeredCurrent = false;
    $('#runner-position').textContent = `Întrebarea ${activeSession.index + 1} din ${activeSession.questions.length}`;
    $('#runner-score').textContent = `${activeSession.correct} corecte`;
    $('#runner-progress-bar').style.width = `${((activeSession.index + 1) / activeSession.questions.length) * 100}%`;
    $('#question-subject').textContent = SUBJECTS[q.subject].label;
    $('#question-topic').textContent = getTopicLabel(q.subject, q.topic);
    $('#question-prompt').textContent = q.prompt;
    $('#question-feedback').hidden = true;
    $('#question-feedback').innerHTML = '';
    $('#next-question').disabled = true;
    $('#next-question').textContent = activeSession.index === activeSession.questions.length - 1 ? 'Finalizează' : 'Următoarea';

    const answers = $('#answers-list');
    answers.innerHTML = '';
    q.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'answer-option';
      button.innerHTML = `<span class="answer-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(option)}</span>`;
      button.addEventListener('click', () => selectAnswer(index));
      answers.appendChild(button);
    });
  }

  function selectAnswer(index) {
    if (!activeSession || activeSession.answeredCurrent) return;
    const q = activeSession.questions[activeSession.index];
    const isCorrect = index === q.correctIndex;
    activeSession.answeredCurrent = true;
    activeSession.answers.push({ id: q.id, selectedIndex: index, correct: isCorrect });
    if (isCorrect) activeSession.correct += 1;
    recordAnswer(q.id, isCorrect);

    const buttons = $$('.answer-option', $('#answers-list'));
    buttons.forEach((button, buttonIndex) => {
      button.disabled = true;
      if (activeSession.mode === 'practice') {
        if (buttonIndex === q.correctIndex) button.classList.add('is-correct');
        if (buttonIndex === index && !isCorrect) button.classList.add('is-wrong');
      } else if (buttonIndex === index) {
        button.classList.add('is-selected');
      }
    });

    if (activeSession.mode === 'practice') showFeedback(q, isCorrect);
    $('#runner-score').textContent = `${activeSession.correct} corecte`;
    $('#next-question').disabled = false;
  }

  function showFeedback(question, isCorrect) {
    const feedback = $('#question-feedback');
    const answer = question.options[question.correctIndex];
    const explanation = question.explanation?.trim() || 'Explicația detaliată nu a fost introdusă încă.';
    const source = question.source?.trim();
    feedback.className = `question-feedback ${isCorrect ? 'is-correct' : 'is-wrong'}`;
    feedback.innerHTML = `<strong>${isCorrect ? 'Corect.' : 'Răspuns incorect.'}</strong><p>Răspuns corect: <b>${String.fromCharCode(65 + question.correctIndex)}. ${escapeHtml(answer)}</b></p><p>${escapeHtml(explanation)}</p>${source ? `<small>Sursă: ${escapeHtml(source)}</small>` : ''}`;
    feedback.hidden = false;
  }

  function recordAnswer(id, isCorrect) {
    const current = getQuestionStats(id);
    state.answers[id] = {
      attempts: current.attempts + 1,
      correct: current.correct + (isCorrect ? 1 : 0),
      lastCorrect: isCorrect,
      updatedAt: new Date().toISOString()
    };
    saveState();
  }

  function nextQuestion() {
    if (!activeSession || !activeSession.answeredCurrent) return;
    if (activeSession.index >= activeSession.questions.length - 1) {
      finishSession();
      return;
    }
    activeSession.index += 1;
    renderCurrentQuestion();
  }

  function finishSession() {
    if (!activeSession) return;
    const total = activeSession.questions.length;
    const correct = activeSession.correct;
    const result = {
      date: new Date().toISOString(),
      mode: activeSession.mode,
      total,
      correct,
      percent: percent(correct, total)
    };
    state.sessions.push(result);
    if (state.sessions.length > 100) state.sessions = state.sessions.slice(-100);
    saveState();

    $('#quiz-runner').hidden = true;
    $('#quiz-results').hidden = false;
    $('#results-percent').textContent = `${result.percent}%`;
    $('#results-title').textContent = `${correct} din ${total} răspunsuri corecte`;
    $('#results-summary').textContent = activeSession.mode === 'test' ? 'Rezultatul include toate răspunsurile din sesiunea de test.' : 'Progresul a fost salvat local pe acest dispozitiv.';
    updateAllUI();
  }

  function leaveSession() {
    if (!activeSession || confirm('Ieși din sesiunea curentă? Răspunsurile deja date rămân salvate.')) {
      activeSession = null;
      $('#quiz-runner').hidden = true;
      $('#quiz-results').hidden = true;
      $('#training-setup').hidden = false;
      updateTrainingAvailability();
    }
  }

  function resetTrainingView() {
    activeSession = null;
    $('#quiz-runner').hidden = true;
    $('#quiz-results').hidden = true;
    $('#training-setup').hidden = false;
    updateTrainingAvailability();
  }

  function repeatLastSession() {
    if (!lastSessionConfig) return resetTrainingView();
    selectedMode = lastSessionConfig.mode;
    $$('.mode-card').forEach(button => {
      const active = button.dataset.mode === selectedMode;
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-checked', String(active));
    });
    $('#subject-filter').value = lastSessionConfig.subject;
    updateTopicFilter();
    $('#topic-filter').value = lastSessionConfig.topic;
    $('#count-filter').value = lastSessionConfig.count;
    resetTrainingView();
  }

  function renderProgress() {
    const stats = aggregateStats();
    const cards = $('#progress-subjects');
    cards.innerHTML = '';
    ['romana', 'istorie'].forEach(subject => {
      const data = stats.bySubject[subject];
      const available = questionBank.filter(q => q.subject === subject).length;
      const ratio = percent(data.correct, data.answered);
      const topics = TOPICS[subject].map(([key, label]) => {
        const topicQuestions = questionBank.filter(q => q.subject === subject && q.topic === key);
        const topicIds = new Set(topicQuestions.map(q => q.id));
        let attempts = 0;
        let correct = 0;
        topicIds.forEach(id => {
          const qStats = getQuestionStats(id);
          attempts += qStats.attempts;
          correct += qStats.correct;
        });
        return `<div class="topic-stat"><span>${escapeHtml(label)}</span><strong>${percent(correct, attempts)}%</strong><small>${topicQuestions.length} grile · ${attempts} răspunsuri</small></div>`;
      }).join('');
      cards.insertAdjacentHTML('beforeend', `<article class="panel-card progress-subject-card"><div class="progress-card-head"><div><p class="eyebrow">${SUBJECTS[subject].label}</p><h2>${ratio}% corecte</h2></div><span class="bank-chip"><strong>${available}</strong><span>grile</span></span></div><div class="progress-line large"><span style="width:${ratio}%"></span></div><div class="topic-stats">${topics}</div></article>`);
    });

    const recent = $('#recent-sessions');
    const sessions = [...state.sessions].reverse().slice(0, 10);
    recent.innerHTML = sessions.length ? sessions.map(session => `<div class="session-row"><span>${new Date(session.date).toLocaleString('ro-RO')}</span><strong>${session.correct}/${session.total} · ${session.percent}%</strong></div>`).join('') : '<p class="muted">Nu există sesiuni finalizate încă.</p>';
  }

  function exportProgress() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `snpp-training-progres-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast('Progresul a fost exportat.');
  }

  async function importProgress(file) {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!isValidState(parsed)) throw new Error('Fișier incompatibil.');
      state = parsed;
      saveState();
      applyTheme(state.theme);
      updateAllUI();
      toast('Progresul a fost importat.');
    } catch (error) {
      console.error(error);
      toast('Fișierul de progres nu este valid.', true);
    }
  }

  function resetProgress() {
    if (!confirm('Ștergi definitiv tot progresul salvat pe acest dispozitiv?')) return;
    state = defaultState();
    saveState();
    applyTheme(state.theme);
    updateAllUI();
    toast('Progresul local a fost șters.');
  }

  function updateAllUI() {
    updateDashboard();
    updateTrainingAvailability();
    if (!$('#view-progress').hidden) renderProgress();
  }

  function toast(message, error = false) {
    const region = $('#toast-region');
    const element = document.createElement('div');
    element.className = `toast ${error ? 'is-error' : ''}`;
    element.textContent = message;
    region.appendChild(element);
    requestAnimationFrame(() => element.classList.add('is-visible'));
    setTimeout(() => {
      element.classList.remove('is-visible');
      setTimeout(() => element.remove(), 220);
    }, 3200);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
  }

  function bindEvents() {
    $$('[data-view]').forEach(button => button.addEventListener('click', () => setView(button.dataset.view)));
    $$('[data-go-training]').forEach(button => button.addEventListener('click', () => setView('training')));
    $('#theme-cycle').addEventListener('click', cycleTheme);
    $$('[data-theme-choice]').forEach(button => button.addEventListener('click', () => applyTheme(button.dataset.themeChoice)));

    $$('.mode-card').forEach(button => button.addEventListener('click', () => {
      selectedMode = button.dataset.mode;
      $$('.mode-card').forEach(other => {
        const active = other === button;
        other.classList.toggle('is-selected', active);
        other.setAttribute('aria-checked', String(active));
      });
      updateTrainingAvailability();
    }));

    $('#subject-filter').addEventListener('change', updateTrainingAvailability);
    $('#topic-filter').addEventListener('change', updateTrainingAvailability);
    $('#count-filter').addEventListener('change', updateTrainingAvailability);
    $('#start-session').addEventListener('click', () => startSession());
    $('#quick-start').addEventListener('click', () => {
      selectedMode = 'practice';
      setView('training');
      $('#subject-filter').value = 'all';
      updateTopicFilter();
      $('#topic-filter').value = 'all';
      const pool = shuffle(questionBank).slice(0, Math.min(20, questionBank.length));
      if (pool.length) startSession({ mode: 'practice', questions: pool });
    });
    $('#next-question').addEventListener('click', nextQuestion);
    $('#quit-session').addEventListener('click', leaveSession);
    $('#repeat-session').addEventListener('click', repeatLastSession);
    $('#back-to-training').addEventListener('click', resetTrainingView);
    $('#export-progress').addEventListener('click', exportProgress);
    $('#import-progress').addEventListener('change', event => importProgress(event.target.files?.[0]));
    $('#reset-progress').addEventListener('click', resetProgress);
  }

  function initialize() {
    bindEvents();
    applyTheme(state.theme);
    reloadQuestionBank();
    const initialView = location.hash.replace('#', '');
    if (VIEW_META[initialView]) setView(initialView, { focus: false });
  }

  window.SNPPTraining = { reloadQuestionBank, validateQuestionBank };

  initialize();
})();
