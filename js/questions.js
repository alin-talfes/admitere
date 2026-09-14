/**
 * Registru modular pentru banca de grile Admitere SNPP Training.
 *
 * Fisierele pe ani se incarca dupa acest fisier si inainte de app.js.
 * Fiecare rand dintr-un lot are forma:
 * [id, subject, topic, prompt, options, correctIndex, source, explanation]
 */
(() => {
  'use strict';

  window.QUESTION_BANK = [];

  window.registerQuestionBatch = (items) => {
    if (!Array.isArray(items)) throw new TypeError('Lotul de grile trebuie sa fie un array.');

    items.forEach((item, index) => {
      if (!Array.isArray(item) || item.length < 6) {
        throw new TypeError(`Grila #${index + 1} din lot are o structura invalida.`);
      }

      const [id, subject, topic, prompt, options, correctIndex, source = '', explanation = ''] = item;
      window.QUESTION_BANK.push({ id, subject, topic, prompt, options, correctIndex, source, explanation });
    });
  };
})();
