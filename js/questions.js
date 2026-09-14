/**
 * Registru modular pentru banca de grile Admitere SNPP Training.
 *
 * Fisierele pe ani se incarca dupa acest fisier si inainte de app.js.
 * Fiecare rand dintr-un lot are forma:
 * [id, subject, topic, prompt, options, correctIndex, source, explanation]
 *
 * IMPORTANT: o grila aflata in QUARANTINED_QUESTION_IDS nu ajunge in banca activa.
 * Carantina este folosita pentru itemi care necesita reverificarea transcrierii,
 * a formatarii, contin erori materiale in subiectul oficial sau necesita verificarea
 * compatibilitatii cu bibliografia curenta.
 */
(() => {
  'use strict';

  window.QUESTION_BANK = [];

  const QUARANTINED_QUESTION_IDS = new Set([
    // 2022: sensul itemului depinde de sublinierea din documentul oficial.
    '2022-ro-031',
    '2022-ro-033',

    // 2020: item de romana dependent de cuvantul subliniat in original.
    '2020-ro-032',

    // 2020 Istorie: probleme materiale ale subiectului oficial.
    // Q1 ofera 1900/2000/1800/1990, desi Palatul Parlamentului a inceput sa fie construit in anii 1980.
    '2020-ist-001',
    // Q27 mentioneaza 18.180.311 ha; cifra documentata pentru reforma agrara este 1.810.311 ha.
    '2020-ist-027',

    // 2019: itemi care cer analiza unor cuvinte marcate/subliniate in original.
    '2019-ro-015',
    '2019-ro-025',
    '2019-ro-027',
    '2019-ro-047',
    '2019-ro-048',
    '2019-ro-065',

    // 2018: transcriere incompleta/corupta sau marcaje grafice pierdute.
    // Q40 are un prompt intern contradictoriu in transcrierea curenta.
    '2018-ro-040',
    // Q63 cere cazurile pronumelor subliniate; marcajele nu sunt pastrate in text simplu.
    '2018-ro-063',

    // 2017: variantele Q52 se deosebesc prin numarul de "i" in original,
    // dar transcrierea curenta le afiseaza identic si itemul nu poate fi rezolvat corect.
    '2017-ro-052'
  ]);

  const VALID_SUBJECTS = new Set(['romana', 'istorie']);
  const seenQuestionIds = new Set();

  window.QUESTION_AUDIT = {
    quarantined: QUARANTINED_QUESTION_IDS,
    skipped: [],
    registered: 0
  };

  const validateQuestion = (item, index) => {
    if (!Array.isArray(item) || item.length < 6) {
      throw new TypeError(`Grila #${index + 1} din lot are o structura invalida.`);
    }

    const [id, subject, topic, prompt, options, correctIndex, source = '', explanation = ''] = item;

    if (typeof id !== 'string' || !/^\d{4}-(?:ro|ist)-\d{3}$/.test(id)) {
      throw new TypeError(`Grila #${index + 1} are un ID invalid: ${String(id)}.`);
    }
    if (seenQuestionIds.has(id)) {
      throw new Error(`ID de grila duplicat: ${id}.`);
    }
    if (!VALID_SUBJECTS.has(subject)) {
      throw new TypeError(`Materia este invalida pentru ${id}: ${String(subject)}.`);
    }
    if (typeof topic !== 'string' || topic.trim() === '') {
      throw new TypeError(`Tema lipseste pentru ${id}.`);
    }
    if (typeof prompt !== 'string' || prompt.trim() === '') {
      throw new TypeError(`Enuntul lipseste pentru ${id}.`);
    }
    if (!Array.isArray(options) || options.length !== 4 || options.some((option) => typeof option !== 'string' || option.trim() === '')) {
      throw new TypeError(`Grila ${id} trebuie sa aiba exact 4 variante text nevid.`);
    }
    if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3) {
      throw new RangeError(`Indicele raspunsului corect este invalid pentru ${id}: ${String(correctIndex)}.`);
    }
    if (typeof source !== 'string' || typeof explanation !== 'string') {
      throw new TypeError(`Sursa si explicatia trebuie sa fie text pentru ${id}.`);
    }

    seenQuestionIds.add(id);
    return { id, subject, topic, prompt, options, correctIndex, source, explanation };
  };

  window.registerQuestionBatch = (items) => {
    if (!Array.isArray(items)) throw new TypeError('Lotul de grile trebuie sa fie un array.');

    items.forEach((item, index) => {
      const question = validateQuestion(item, index);

      if (QUARANTINED_QUESTION_IDS.has(question.id)) {
        window.QUESTION_AUDIT.skipped.push(question.id);
        return;
      }

      window.QUESTION_BANK.push(question);
      window.QUESTION_AUDIT.registered += 1;
    });
  };
})();
