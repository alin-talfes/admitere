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
      if (typeof q.id !== 'string' || !q.id.trim()) errors.push(`${prefix}: lipsește id.`);
      else if (ids.has(q.id)) errors.push(`${prefix}: id duplicat „${q.id}”.`);
      else ids.add(q.id);
      if (!SUBJECTS[q.subject]) errors.push(`${prefix}: materia „${q.subject ?? ''}” nu este validă.`);
      const validTopics = TOPICS[q.subject]?.map(([key]) => key) ?? [];
      if (!validTopics.includes(q.topic)) errors.push(`${prefix}: tema „${q.topic ?? ''}” nu este validă pentru materie.`);
      if (typeof q.prompt !== 'string' || !q.prompt.trim()) errors.push(`${prefix}: enunț lipsă.`);
      if (!Array.isArray(q.options) || q.options.length < 2 || q.options.some(o => typeof o !== 'string' || !o.trim())) errors.push(`${prefix}: opțiunile trebuie să conțină cel puțin două texte valide.`);
      if (!Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex >= (q.options?.length ?? 0)) errors.push(`${prefix}: correctIndex este invalid.`);
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

    for (const question of questionBank) {
      const stats = getQuestionStats(question.id);
      answered += stats.attempts;
      correct += stats.correct;
      if (stats.attempts > 0 && stats.lastCorrect === false) mistakes += 1;
      bySubject[question.subject].answered += stats.attempts;
      bySubject[question.subject].correct += stats.correct;
    }

    return { answered, correct, mistakes, bySubject, sessions: state.sessions.length };
  }

  function percent(correct, total) {
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  }

  function updateDashboard() {
    const stats = aggregateStats();
    const rate = percent(stats.correct, stats.answered);
    $('#stat-answered').textContent = stats.answered;
    $('#stat-correct').textContent = stats.correct;
    $('#stat-sessions').textContent = stats.sessions;
    $('#stat-bank').textContent = questionBank.length;
    $('#overall-percent').textContent = `${rate}%`;
    $('#overall-ring').style.setProperty('--progress', `${rate * 3.6}deg`);
    $('#overall-caption').textContent = stats.answered ? `${stats.correct} din ${stats.answered} răspunsuri corecte` : 'Nicio grilă rezolvată încă';

    ['romana', 'istorie'].forEach(subject => {
      const count = questionBank.filter(q => q.subject === subject).length;
      const s = stats.bySubject[subject];
      const rateSubject = percent(s.correct, s.answered);
      const prefix = subject === 'romana' ? 'romanian' : 'history';
      $(`#${prefix}-progress`).style.width = `${rateSubject}%`;
      $(`#${prefix}-meta`).textContent = `${count} ${count === 1 ? 'grilă disponibilă' : 'grile disponibile'}`;
    });
  }

  function populateTopicFilter() {
    const subject = $('#subject-filter').value;
    const select = $('#topic-filter');
    const previous = select.value;
    select.replaceChildren(new Option('Toate temele', 'all'));
    const subjects = subject === 'all' ? Object.keys(TOPICS) : [subject];
    subjects.forEach(s => {
      const group = document.createElement('optgroup');
      group.label = SUBJECTS[s].label;
      TOPICS[s].forEach(([key, label]) => group.append(new Option(label, `${s}:${key}`)));
      select.append(group);
    });
    if ([...select.options].some(o => o.value === previous)) select.value = previous;
  }

  function filteredPool() {
    const subject = $('#subject-filter').value;
    const topicValue = $('#topic-filter').value;
    let pool = questionBank.filter(q => subject === 'all' || q.subject === subject);
    if (topicValue !== 'all') {
      const [topicSubject, topic] = topicValue.split(':');
      pool = pool.filter(q => q.subject === topicSubject && q.topic === topic);
    }
    if (selectedMode === 'mistakes') pool = pool.filter(q => getQuestionStats(q.id).lastCorrect === false);
    return pool;
  }

  function updateTrainingAvailability() {
    const pool = filteredPool();
    const button = $('#start-session');
    const title = $('#availability-title');
    const text = $('#availability-text');
    $('#bank-count').textContent = questionBank.length;

    if (questionBank.length === 0) {
      title.textContent = 'Banca de grile nu este încă încărcată.';
      text.textContent = 'Interfața și motorul de testare sunt pregătite. Următoarea etapă este introducerea întrebărilor.';
      button.disabled = true;
      return;
    }
    if (pool.length === 0) {
      title.textContent = selectedMode === 'mistakes' ? 'Nu există greșeli de reluat pentru filtrul ales.' : 'Nu există grile pentru filtrul ales.';
      text.textContent = 'Modifică materia, tema sau modul de antrenament.';
      button.disabled = true;
      return;
    }
    title.textContent = `${pool.length} ${pool.length === 1 ? 'grilă disponibilă' : 'grile disponibile'} pentru selecția curentă.`;
    text.textContent = selectedMode === 'practice' ? 'Răspunsul și explicația vor apărea imediat.' : selectedMode === 'test' ? 'Rezultatul complet va apărea la final.' : 'Vor fi incluse numai grilele greșite la ultima încercare.';
    button.disabled = false;
  }

  function shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function startSession(config = null) {
    const resolvedConfig = config ?? {
      mode: selectedMode,
      subject: $('#subject-filter').value,
      topic: $('#topic-filter').value,
      count: $('#count-filter').value
    };
    selectedMode = resolvedConfig.mode;
    $('#subject-filter').value = resolvedConfig.subject;
    populateTopicFilter();
    $('#topic-filter').value = resolvedConfig.topic;
    $('#count-filter').value = resolvedConfig.count;

    let pool = filteredPool();
    if (!pool.length) { updateTrainingAvailability(); return; }
    pool = shuffle(pool);
    if (resolvedConfig.count !== 'all') pool = pool.slice(0, Number(resolvedConfig.count));

    activeSession = {
      id: `session-${Date.now()}`,
      mode: resolvedConfig.mode,
      startedAt: new Date().toISOString(),
      questions: pool,
      index: 0,
      answers: [],
      locked: false
    };
    lastSessionConfig = { ...resolvedConfig };
    $('#training-setup').hidden = true;
    $('.tips-card').hidden = true;
    $('#quiz-results').hidden = true;
    $('#quiz-runner').hidden = false;
    renderCurrentQuestion();
  }

  function renderCurrentQuestion() {
    if (!activeSession) return;
    const question = activeSession.questions[activeSession.index];
    const total = activeSession.questions.length;
    const answeredCorrect = activeSession.answers.filter(a => a.correct).length;
    $('#runner-position').textContent = `Întrebarea ${activeSession.index + 1} din ${total}`;
    $('#runner-score').textContent = `${answeredCorrect} corecte`;
    $('#runner-progress-bar').style.width = `${(activeSession.index / total) * 100}%`;
    $('#question-subject').textContent = SUBJECTS[question.subject].label;
    $('#question-topic').textContent = getTopicLabel(question.subject, question.topic);
    $('#question-prompt').textContent = question.prompt;
    $('#question-feedback').hidden = true;
    $('#question-feedback').replaceChildren();
    $('#next-question').disabled = true;
    $('#next-question').textContent = activeSession.index === total - 1 ? 'Finalizează' : 'Următoarea';
    activeSession.locked = false;

    const answers = $('#answers-list');
    answers.replaceChildren();
    question.options.forEach((option, optionIndex) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'answer-button';
      button.dataset.optionIndex = String(optionIndex);
      const letter = document.createElement('span');
      letter.className = 'answer-letter';
      letter.textContent = String.fromCharCode(65 + optionIndex);
      const text = document.createElement('span');
      text.textContent = option;
      button.append(letter, text);
      button.addEventListener('click', () => chooseAnswer(optionIndex));
      answers.append(button);
    });
  }

  function chooseAnswer(optionIndex) {
    if (!activeSession || activeSession.locked) return;
    const question = activeSession.questions[activeSession.index];
    const isCorrect = optionIndex === question.correctIndex;
    activeSession.locked = true;
    activeSession.answers.push({ questionId: question.id, selectedIndex: optionIndex, correct: isCorrect });
    recordAnswer(question, isCorrect);

    $$('.answer-button').forEach((button, index) => {
      button.disabled = true;
      if (index === optionIndex) button.classList.add('is-selected');
      if (activeSession.mode !== 'test') {
        if (index === question.correctIndex) button.classList.add('is-correct');
        else if (index === optionIndex) button.classList.add('is-wrong');
      }
    });

    if (activeSession.mode !== 'test') showFeedback(question, isCorrect);
    $('#next-question').disabled = false;
    $('#runner-score').textContent = `${activeSession.answers.filter(a => a.correct).length} corecte`;
  }

  function showFeedback(question, isCorrect) {
    const box = $('#question-feedback');
    const title = document.createElement('strong');
    title.textContent = isCorrect ? 'Răspuns corect.' : `Răspuns greșit. Varianta corectă: ${String.fromCharCode(65 + question.correctIndex)}.`;
    box.append(title);
    if (question.explanation) {
      const explanation = document.createElement('span');
      explanation.textContent = question.explanation;
      box.append(explanation);
    }
    if (question.source) {
      const source = document.createElement('span');
      source.textContent = `Sursă: ${question.source}`;
      box.append(source);
    }
    box.hidden = false;
  }

  function recordAnswer(question, isCorrect) {
    const previous = state.answers[question.id] ?? { attempts: 0, correct: 0, lastCorrect: null, updatedAt: null };
    state.answers[question.id] = {
      attempts: (Number(previous.attempts) || 0) + 1,
      correct: (Number(previous.correct) || 0) + (isCorrect ? 1 : 0),
      lastCorrect: isCorrect,
      updatedAt: new Date().toISOString()
    };
    saveState();
    updateDashboard();
  }

  function nextQuestion() {
    if (!activeSession || !activeSession.locked) return;
    if (activeSession.index < activeSession.questions.length - 1) {
      activeSession.index += 1;
      renderCurrentQuestion();
      return;
    }
    finishSession();
  }

  function finishSession() {
    if (!activeSession) return;
    const total = activeSession.questions.length;
    const correct = activeSession.answers.filter(a => a.correct).length;
    const sessionRecord = {
      id: activeSession.id,
      mode: activeSession.mode,
      startedAt: activeSession.startedAt,
      finishedAt: new Date().toISOString(),
      total,
      correct,
      subject: $('#subject-filter').value,
      topic: $('#topic-filter').value
    };
    state.sessions.unshift(sessionRecord);
    state.sessions = state.sessions.slice(0, 100);
    saveState();

    const rate = percent(correct, total);
    $('#quiz-runner').hidden = true;
    $('#quiz-results').hidden = false;
    $('#results-percent').textContent = `${rate}%`;
    $('#results-title').textContent = `${correct} din ${total} răspunsuri corecte`;
    $('#results-summary').textContent = rate >= 90 ? 'Rezultat foarte bun. Pentru consolidare, repetă periodic temele cu erori.' : rate >= 70 ? 'Bază bună. Prioritizează întrebările greșite înaintea următoarei sesiuni.' : 'Este utilă o recapitulare pe temele cu cele mai multe erori înainte de un nou test.';
    activeSession = null;
    updateAllUI();
  }

  function quitSession() {
    if (!activeSession) return;
    if (activeSession.answers.length > 0 && !confirm('Ieși din sesiune? Răspunsurile deja date rămân salvate, dar sesiunea nu va fi înregistrată ca finalizată.')) return;
    activeSession = null;
    $('#quiz-runner').hidden = true;
    $('#quiz-results').hidden = true;
    $('#training-setup').hidden = false;
    $('.tips-card').hidden = false;
    updateTrainingAvailability();
  }

  function showTrainingSetup() {
    activeSession = null;
    $('#quiz-runner').hidden = true;
    $('#quiz-results').hidden = true;
    $('#training-setup').hidden = false;
    $('.tips-card').hidden = false;
    updateTrainingAvailability();
  }

  function recordForQuestion(question) {
    const stats = getQuestionStats(question.id);
    return { ...stats, subject: question.subject, topic: question.topic };
  }

  function renderProgress() {
    const stats = aggregateStats();
    $('#progress-rate').textContent = `${percent(stats.correct, stats.answered)}%`;
    $('#progress-ro-rate').textContent = `${percent(stats.bySubject.romana.correct, stats.bySubject.romana.answered)}%`;
    $('#progress-hi-rate').textContent = `${percent(stats.bySubject.istorie.correct, stats.bySubject.istorie.answered)}%`;
    $('#progress-ro-count').textContent = `${stats.bySubject.romana.answered} răspunsuri`;
    $('#progress-hi-count').textContent = `${stats.bySubject.istorie.answered} răspunsuri`;
    $('#progress-mistakes').textContent = stats.mistakes;

    const groups = new Map();
    questionBank.forEach(question => {
      const record = recordForQuestion(question);
      if (!record.attempts) return;
      const key = `${question.subject}:${question.topic}`;
      const current = groups.get(key) ?? { subject: question.subject, topic: question.topic, attempts: 0, correct: 0 };
      current.attempts += record.attempts;
      current.correct += record.correct;
      groups.set(key, current);
    });

    const performanceHost = $('#topic-performance');
    if (!groups.size) {
      performanceHost.className = 'empty-state';
      performanceHost.replaceChildren(makeTextBlock('Nu există încă date.', 'Rezolvă grile pentru a vedea performanța pe fiecare temă.'));
    } else {
      performanceHost.className = 'performance-list';
      performanceHost.replaceChildren(...[...groups.values()].sort((a,b) => percent(a.correct,a.attempts) - percent(b.correct,b.attempts)).map(group => {
        const row = document.createElement('div');
        row.className = 'performance-row';
        const head = document.createElement('div');
        head.className = 'performance-head';
        const label = document.createElement('strong');
        label.textContent = getTopicLabel(group.subject, group.topic);
        const metric = document.createElement('span');
        const rate = percent(group.correct, group.attempts);
        metric.textContent = `${rate}% · ${group.attempts} răsp.`;
        head.append(label, metric);
        const bar = document.createElement('div');
        bar.className = 'progress-line';
        const fill = document.createElement('span');
        fill.style.width = `${rate}%`;
        bar.append(fill);
        row.append(head, bar);
        return row;
      }));
    }

    const sessionsHost = $('#recent-sessions');
    if (!state.sessions.length) {
      sessionsHost.className = 'empty-state';
      sessionsHost.replaceChildren(makeTextBlock('Nicio sesiune finalizată.', 'Ultimele rezultate vor apărea aici.'));
    } else {
      sessionsHost.className = 'session-list';
      sessionsHost.replaceChildren(...state.sessions.slice(0, 8).map(session => {
        const row = document.createElement('div');
        row.className = 'session-row';
        const left = document.createElement('div');
        const title = document.createElement('strong');
        title.textContent = session.mode === 'practice' ? 'Învățare' : session.mode === 'mistakes' ? 'Greșeli' : 'Test';
        const date = document.createElement('span');
        date.textContent = formatDate(session.finishedAt);
        left.append(title, document.createElement('br'), date);
        const right = document.createElement('strong');
        right.textContent = `${session.correct}/${session.total}`;
        row.append(left, right);
        return row;
      }));
    }
  }

  function makeTextBlock(titleText, bodyText) {
    const wrap = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = titleText;
    const body = document.createElement('span');
    body.textContent = bodyText;
    wrap.append(title, body);
    return wrap;
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Dată necunoscută';
    return new Intl.DateTimeFormat('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
  }

  function exportProgress() {
    const payload = JSON.stringify(state, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `snpp-progres-${new Date().toISOString().slice(0,10)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast('Progresul a fost exportat.');
  }

  async function importProgress(file) {
    if (!file) return;
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error('Fișierul este prea mare.');
      const parsed = JSON.parse(await file.text());
      if (!isValidState(parsed)) throw new Error('Fișier incompatibil sau structură invalidă.');
      state = parsed;
      saveState();
      applyTheme(state.theme);
      updateAllUI();
      toast('Progresul a fost importat.');
    } catch (error) {
      toast(`Import eșuat: ${error.message}`, true);
    } finally {
      $('#import-progress').value = '';
    }
  }

  function resetProgress() {
    if (!confirm('Ștergi toate răspunsurile și sesiunile salvate local? Acțiunea nu poate fi anulată.')) return;
    const theme = state.theme;
    state = defaultState();
    state.theme = theme;
    saveState();
    updateAllUI();
    toast('Progresul local a fost resetat.');
  }

  function toast(message, isError = false) {
    const host = $('#toast-region');
    if (!host) return;
    const item = document.createElement('div');
    item.className = `toast${isError ? ' is-error' : ''}`;
    item.textContent = message;
    host.append(item);
    setTimeout(() => item.remove(), 3600);
  }

  function updateAllUI() {
    updateDashboard();
    populateTopicFilter();
    updateTrainingAvailability();
    renderProgress();
    applyTheme(state.theme);
  }

  function bindEvents() {
    $$('[data-view]').forEach(button => button.addEventListener('click', () => setView(button.dataset.view)));
    $$('[data-go-view]').forEach(button => button.addEventListener('click', () => setView(button.dataset.goView)));
    $$('[data-subject-open]').forEach(button => button.addEventListener('click', () => {
      const id = button.dataset.subjectOpen === 'romana' ? '#curriculum-romana' : '#curriculum-istorie';
      setView('curriculum');
      requestAnimationFrame(() => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }));

    $('#theme-cycle').addEventListener('click', cycleTheme);
    $$('[data-theme-choice]').forEach(button => button.addEventListener('click', () => applyTheme(button.dataset.themeChoice)));

    $$('.mode-card').forEach(button => button.addEventListener('click', () => {
      selectedMode = button.dataset.mode;
      $$('.mode-card').forEach(item => {
        const active = item === button;
        item.classList.toggle('is-selected', active);
        item.setAttribute('aria-checked', String(active));
      });
      updateTrainingAvailability();
    }));

    $('#subject-filter').addEventListener('change', () => { populateTopicFilter(); updateTrainingAvailability(); });
    $('#topic-filter').addEventListener('change', updateTrainingAvailability);
    $('#count-filter').addEventListener('change', updateTrainingAvailability);
    $('#start-session').addEventListener('click', () => startSession());
    $('#next-question').addEventListener('click', nextQuestion);
    $('#quit-session').addEventListener('click', quitSession);
    $('#retry-session').addEventListener('click', () => lastSessionConfig && startSession(lastSessionConfig));
    $('#back-to-setup').addEventListener('click', showTrainingSetup);

    $('#export-progress').addEventListener('click', exportProgress);
    $('#import-progress').addEventListener('change', event => importProgress(event.target.files?.[0]));
    $('#reset-progress').addEventListener('click', resetProgress);

    window.addEventListener('hashchange', () => {
      const view = location.hash.replace('#', '');
      if (VIEW_META[view]) setView(view, { focus: false });
    });
  }

  function init() {
    bindEvents();
    reloadQuestionBank();
    const initialView = location.hash.replace('#', '');
    setView(VIEW_META[initialView] ? initialView : 'dashboard', { focus: false });
  }

  window.SnppTraining = Object.freeze({
    validateQuestionBank,
    reloadQuestionBank,
    getQuestionCount: () => questionBank.length,
    getStateSnapshot: () => JSON.parse(JSON.stringify(state)),
    startSession: config => startSession(config)
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
