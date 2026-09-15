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

    // 2021: incompatibilitati sau ambiguitati fata de bibliografia curenta.
    // Q10 are acum cel putin doua variante admisibile: DOOM3 accepta acordul la plural
    // in constructii de tipul „Majoritatea studentilor vor...”.
    '2021-ro-010',
    // Q16 foloseste o despartire/grafie istorica ce nu corespunde normei DOOM3 pentru sandvici/sendvis.
    '2021-ro-016',
    // Q19 foloseste terminologia traditionala „moduri nepersonale”; gramatica actuala
    // din bibliografia 2026 le trateaza drept forme verbale nepersonale/nonfinite, nu moduri.
    '2021-ro-019',
    // Q29 trateaza „ce” dintr-o interogativa indirecta drept simplu pronume relativ;
    // gramatica actuala il clasifica drept pronume relativ-interogativ.
    '2021-ro-029',
    // Q36 numara numai propozitiile finite, desi gramatica actuala admite, in anumite
    // configuratii, analiza grupului verbal cu infinitiv drept propozitie nonfinita.
    '2021-ro-036',
    // Q39 cere un „pronume relativ”, dar „cine” introduce aici o interogativa indirecta;
    // bibliografia actuala foloseste categoria pronume relativ-interogativ.
    '2021-ro-039',

    // 2020: itemi de romana care nu pot fi folositi sigur in forma curenta.
    // Q32 depinde de cuvantul subliniat in original, marcaj pierdut la transcriere.
    '2020-ro-032',
    // Q43 are cheia istorica bazata pe o despartire care nu mai produce o varianta integral corecta
    // conform regulilor DOOM3: vâr-stă si sculp-tă trebuie respectate simultan.
    '2020-ro-043',
    // Q48 foloseste clasificarea traditionala „numeral colectiv/distributiv/fractionar”.
    // Gramatica indicata in bibliografia actuala trateaza aceste forme drept constructii,
    // pronume/adjective pronominale sau substantive, nu drept clase de numeral distincte.
    '2020-ro-048',

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
    // Q24 are doua variante transcrise identic desi baremul indica o singura litera;
    // diferenta grafica de accent trebuie recuperata din scanul oficial.
    '2019-ro-024',
    // Q39 are cheia istorica pe o serie care accentueaza „taxi” pe prima silaba.
    // DOOM3 recomanda accentul final: taxí; itemul nu mai are raspunsul istoric valabil.
    '2019-ro-039',
    // Q44 contine un distractor corupt in transcrierea curenta ("i erbivor").
    '2019-ro-044',
    // Q57 contine cel putin o forma grafica pierduta/corupta ("binemeritata") si necesita scanul original.
    '2019-ro-057',
    // Q58 cere numararea cuvintelor corect accentuate, dar marcajele de accent nu sunt pastrate.
    '2019-ro-058',

    // 2018: transcriere incompleta/corupta sau marcaje grafice pierdute.
    // Q40 are un prompt intern contradictoriu in transcrierea curenta.
    '2018-ro-040',
    // Q57 are in transcrierea curenta cel putin doua enunturi cu forma corecta a verbului "a fi".
    // Ramane blocat pana la confruntarea cu scanul oficial.
    '2018-ro-057',
    // Q63 cere cazurile pronumelor subliniate; marcajele nu sunt pastrate in text simplu.
    '2018-ro-063',

    // 2017: itemi care necesita reverificarea scanului oficial.
    // Q23 are in transcrierea curenta doua perechi care pot fi sinonimice.
    '2017-ro-023',
    // Q52 se deosebeste prin numarul de "i" in original, dar transcrierea curenta afiseaza variante identice.
    '2017-ro-052',

    // 2013 Istorie: erori materiale ale subiectului oficial.
    // Q11 da 625.000 drept pierderi totale ale armatei romane in razboi; datele MApN indica
    // 794.562 pierderi totale, dintre care 624.740 numai in campania din est.
    '2013-ist-011',
    // Q24 indica 1522 pentru transformarea Banatului in pasalac; anul corect este 1552,
    // iar acesta nu apare intre variante.
    '2013-ist-024',
    // Q35 atribuie in mod eronat Sfatului Tarii hotararea unirii Bucovinei cu Romania.
    '2013-ist-035'
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
