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
 *
 * Baremul istoric ramane pastrat in fisierul anului. Carantina nu rescrie cheia
 * examenului vechi; impiedica doar folosirea unui item nesigur pentru pregatirea 2026.
 */
(() => {
  'use strict';

  window.QUESTION_BANK = [];

  const QUARANTINED_QUESTION_IDS = new Set([
    // 2022: marcaje pierdute sau analiza sintactica neechivoca doar in paradigma veche.
    '2022-ro-031',
    '2022-ro-033',
    // Q42 numara doar propozitiile finite; gramatica actuala admite analiza structurii
    // infinitivale „de a se intoarce” ca structura/propozitie nonfinita.
    '2022-ro-042',

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
    // Q8: „care” introduce o interogativa indirecta; in gramatica actuala este
    // adjectiv pronominal relativ-interogativ, nu simplu adjectiv pronominal relativ.
    '2020-ro-008',
    // Q9 contine formularea intern contradictorie „adjectiv pronominal din verb la
    // gerunziu acordat”; forma originala trebuie confruntata cu scanul oficial.
    '2020-ro-009',
    // Q15 foloseste terminologia traditionala „moduri nepersonale”; bibliografia 2026
    // foloseste forme verbale nepersonale/nonfinite.
    '2020-ro-015',
    // Q32 depinde de cuvantul subliniat in original, marcaj pierdut la transcriere.
    '2020-ro-032',
    // Q34 cere „diateza reflexiva”; gramatica actuala trateaza separat constructiile
    // cu pronume reflexive, nu o diateza reflexiva distincta.
    '2020-ro-034',
    // Q43 are cheia istorica bazata pe o despartire care nu mai produce o varianta integral corecta
    // conform regulilor DOOM3: vâr-stă si sculp-tă trebuie respectate simultan.
    '2020-ro-043',
    // Q45 are cheia istorica pe o serie de substantive „defective”; DOOM3 a introdus
    // singularul consumabil (fost pluralia tantum in DOOM2), astfel seria nu mai este integral valida.
    '2020-ro-045',
    // Q48 foloseste clasificarea traditionala „numeral colectiv/distributiv/fractionar”.
    // Gramatica indicata in bibliografia actuala trateaza aceste forme drept constructii,
    // pronume/adjective pronominale sau substantive, nu drept clase de numeral distincte.
    '2020-ro-048',

    // 2020 Istorie: probleme materiale ale subiectului oficial.
    // Q1 ofera 1900/2000/1800/1990, desi Palatul Parlamentului a inceput sa fie construit in anii 1980.
    '2020-ist-001',
    // Q27 mentioneaza 18.180.311 ha; cifra documentata pentru reforma agrara este 1.810.311 ha.
    '2020-ist-027',

    // 2019 Istorie: erori materiale sau fidelitate istorica insuficienta.
    // Q11 marcheaza 13 septembrie si formuleaza bilateral „Romania si URSS”, in timp ce sursele
    // oficiale MApN/ISPAIM dateaza Conventia de Armistitiu la 12 septembrie 1944 (noaptea 12/13)
    // si o descriu ca fiind incheiata intre Romania si statele reprezentand Natiunile Unite.
    '2019-ist-011',
    // Q60 atribuie lui Gheorghe Bratianu un episod al Conferintei de Pace de la Paris din 1919;
    // sursele istorice de autoritate indica Ion I.C. Bratianu ca sef al delegatiei si autor al
    // memoriului care sustinea inclusiv recunoasterea unirii Basarabiei. Necesita scanul original.
    '2019-ist-060',

    // 2019: itemi care cer analiza unor cuvinte marcate/subliniate in original.
    '2019-ro-015',
    '2019-ro-025',
    '2019-ro-027',
    '2019-ro-047',
    '2019-ro-048',
    '2019-ro-065',
    // Q23: DOOM3 admite ambele plurale complete/completuri; variantele B si D devin
    // simultan corecte in forma transcrisa.
    '2019-ro-023',
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
    // Q66 foloseste categoria traditionala „atribut apozitional”; gramatica actuala
    // trateaza apozitia separat de atribut.
    '2019-ro-066',

    // 2018: incompatibilitati de norma/grammatica si transcrieri necertificate.
    // Q14 si Q35 trateaza infinitivul/gerunziul ca „moduri nepersonale”; bibliografia
    // actuala foloseste categoria formelor verbale nepersonale/nonfinite.
    '2018-ro-014',
    '2018-ro-035',
    // Q40 are un prompt intern contradictoriu in transcrierea curenta.
    '2018-ro-040',
    // Q45 se bazeaza pe taxonomia veche a numeralelor colective/multiplicative etc.
    '2018-ro-045',
    // Q51: DOOM3 admite suvenire/suveniruri, astfel A si B sunt corecte in forma actuala.
    '2018-ro-051',
    // Q53 are in transcriere cel putin trei forme verbale corecte (mi-ar placea,
    // perfectul simplu „citi”, viitorul „va privi”), desi cheia istorica spune doua.
    '2018-ro-053',
    // Q57 are in transcrierea curenta cel putin doua enunturi cu forma corecta a verbului "a fi".
    // Ramane blocat pana la confruntarea cu scanul oficial.
    '2018-ro-057',
    // Q63 cere cazurile pronumelor subliniate; marcajele nu sunt pastrate in text simplu.
    '2018-ro-063',
    // Q67 numara doar propozitiile finite desi enuntul contine infinitiv si gerunziu,
    // structuri pentru care gramatica actuala admite analiza nonfinita.
    '2018-ro-067',

    // 2017: itemi care necesita reverificarea scanului sau sunt incompatibili cu norma actuala.
    // Q23 are in transcrierea curenta doua perechi care pot fi sinonimice.
    '2017-ro-023',
    // Q41 foloseste „moduri nepersonale” pentru formele verbale nonfinite.
    '2017-ro-041',
    // Q45 da drept corecta seria cu „agheazma”; DOOM3 normeaza agheasma.
    '2017-ro-045',
    // Q52 se deosebeste prin numarul de "i" in original, dar transcrierea curenta afiseaza variante identice.
    '2017-ro-052',
    // Q69 foloseste „completiva indirecta” pentru subordonata ceruta de „a se gandi”;
    // gramatica actuala foloseste complement/completiva prepozitionala.
    '2017-ro-069',

    // 2015 Istorie: raspunsul privind minimum 12 divizii este corect, dar enuntul
    // descrie Convenția de Armistitiu ca fiind intre Romania si URSS. ISPAIM/MApN o
    // identifica drept conventie intre Romania si statele reprezentand Natiunile Unite,
    // semnata din insarcinarea guvernelor URSS, SUA si Regatului Unit.
    '2015-ist-041',

    // 2013 Istorie: erori materiale ale subiectului oficial.
    // Q11 da 625.000 drept pierderi totale ale armatei romane in razboi; datele MApN indica
    // 794.562 pierderi totale, dintre care 624.740 numai in campania din est.
    '2013-ist-011',
    // Q24 indica 1522 pentru transformarea Banatului in pasalac; anul corect este 1552,
    // iar acesta nu apare intre variante.
    '2013-ist-024',
    // Q35 atribuie in mod eronat Sfatului Tarii hotararea unirii Bucovinei cu Romania.
    '2013-ist-035',

    // 2012 Istorie: Q46 amesteca modelele sovietice. GAC/CAP corespund colhozurilor,
    // in timp ce gospodariile agricole de stat corespund sovhozurilor; nu exista o varianta
    // integral corecta in forma actuala a itemului.
    '2012-ist-046'
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
      throw new TypeError(`Enuntul #${index + 1} din lot are o structura invalida.`);
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