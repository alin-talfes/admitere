/**
 * Registru modular pentru banca de grile Admitere SNPP Training.
 *
 * Fisierele pe ani se incarca dupa acest fisier si inainte de app.js.
 * Fiecare rand dintr-un lot are forma:
 * [id, subject, topic, prompt, options, correctIndex, source, explanation]
 *
 * IMPORTANT: o grila aflata in QUARANTINED_QUESTION_IDS nu ajunge in banca activa.
 * Carantina este folosita pentru itemi care necesita reverificarea transcrierii,
 * a formatarii (de ex. cuvinte subliniate) sau a compatibilitatii cu bibliografia 2026.
 */
(() => {
  'use strict';

  window.QUESTION_BANK = [];

  const QUARANTINED_QUESTION_IDS = new Set([
    // 2022: sensul itemului depinde de sublinierea din documentul oficial,
    // formatare pe care interfata text simplu nu o reproduce inca fidel.
    '2022-ro-031',
    '2022-ro-033'
  ]);

  window.QUESTION_AUDIT = {
    quarantined: QUARANTINED_QUESTION_IDS,
    skipped: []
  };

  window.registerQuestionBatch = (items) => {
    if (!Array.isArray(items)) throw new TypeError('Lotul de grile trebuie sa fie un array.');

    items.forEach((item, index) => {
      if (!Array.isArray(item) || item.length < 6) {
        throw new TypeError(`Grila #${index + 1} din lot are o structura invalida.`);
      }

      const [id, subject, topic, prompt, options, correctIndex, source = '', explanation = ''] = item;

      if (QUARANTINED_QUESTION_IDS.has(id)) {
        window.QUESTION_AUDIT.skipped.push(id);
        return;
      }

      window.QUESTION_BANK.push({ id, subject, topic, prompt, options, correctIndex, source, explanation });
    });
  };
})();
