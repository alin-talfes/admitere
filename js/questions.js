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
