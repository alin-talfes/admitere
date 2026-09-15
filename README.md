# Admitere SNPP — Training

Platformă statică, neoficială, pentru pregătirea probei scrise de admitere la Școala Națională de Poliție Penitenciară „Constantin Brâncoveanu” Târgu Ocna.

## Stadiu

Aplicația conține interfața, tematica 2026, motorul de testare, progres local și o bancă modulară de grile istorice auditată gradual.

Banca activă încarcă în prezent:

- Istoria românilor 2013 — 57 itemi activi din 60; Q11, Q24 și Q35 sunt carantinați pentru erori materiale ale subiectului oficial;
- Istoria românilor 2020 — 38 itemi activi din 40; Q1 și Q27 sunt carantinați pentru erori materiale ale subiectului oficial;
- Limba română 2021 — 39 itemi activi din 45; Q10, Q16, Q19, Q29, Q36 și Q39 sunt carantinați după filtrul normativ 2026;
- Istoria românilor 2021 — 30/30 itemi activi;
- Limba română 2022 — numai itemii importați și necarantinați;
- Istoria românilor 2022 — 30/30 itemi încărcați.

După aplicarea carantinei, validatorul automat raportează **233 de itemi activi**.

În staging există acum și:

- `js/questions/2012-history.js` — **24 de itemi de Istorie 2012 selectați conservator**;
- `js/questions/2015-history.js` — **21 de itemi de Istorie 2015 selectați conservator**;
- `js/questions/2016-history.js` — **25 de itemi de Istorie 2016 selectați conservator**.

Pentru aceste loturi au fost păstrate numai întrebările cu enunț și variante complete și cu răspuns istoric verificabil independent, fără ambiguitate. Loturile 2012, 2015 și 2016 nu sunt încă încărcate de `index.html`; activarea rămâne blocată până la confruntarea directă cu grilele oficiale finale și verificarea eventualelor erate/efecte ale contestațiilor. Celelalte fișiere din `js/questions/` rămân de asemenea staging până la închiderea auditului individual. Pentru anii în care documentele oficiale relevante nu pot fi inspectate suficient pentru verificarea cheii și a eventualelor erate, nu se activează întrebări.

Auditul pe ani, eratele identificate, itemii anulați și motivele de carantinare sunt documentate în [`audit/README.md`](audit/README.md) și în fișierele `audit/YYYY.md`.

## Tehnologie

- HTML5 + CSS3 + JavaScript fără framework;
- zero backend / zero bază de date;
- progres stocat în `localStorage` (`snpp-training-state-v1`);
- compatibil cu GitHub Pages din rădăcina repository-ului;
- fără dependențe externe și fără build step.

## Structura unei grile

Fișierele modulare folosesc forma compactă:

```js
[
  "2022-ro-001",       // id unic
  "romana",            // romana | istorie
  "vocabular",         // tema
  "Enunțul întrebării",
  ["A", "B", "C", "D"],
  1,                    // correctIndex: 0..3
  "Sursa exactă",
  "Explicație verificabilă"
]
```

`js/questions.js` transformă fiecare rând în obiectul folosit de aplicație și validează înainte de înregistrare:

- formatul și unicitatea ID-ului;
- disciplina;
- existența temei și a enunțului;
- exact patru variante text nevid;
- `correctIndex` între 0 și 3;
- tipurile câmpurilor `source` și `explanation`.

`js/app.js` efectuează încă o validare a băncii rezultate, inclusiv verificarea relației dintre disciplină și temă.

## Carantina de conținut

`QUARANTINED_QUESTION_IDS` din `js/questions.js` blochează itemii pentru care există o problemă materială cunoscută: transcriere ambiguă, formatare esențială pierdută, item oficial defectuos, incompatibilitate normativă cu bibliografia 2026 sau alt motiv documentat în audit.

Un item carantinat poate rămâne în fișierul istoric pentru trasabilitate, dar nu ajunge în `window.QUESTION_BANK` și nu poate apărea într-o sesiune de antrenament.

## Regula de includere

Faptul că un răspuns apare într-un barem istoric nu este suficient pentru activare. Pentru publicare se verifică: sursa oficială, fidelitatea enunțului și variantelor, cheia finală, eratele/contestațiile, eventualele marcaje grafice, corectitudinea materială și compatibilitatea cu tematica și bibliografia concursului țintă.

Pentru loturile de staging poate fi folosită o transcriere secundară numai pentru recuperarea enunțului și a variantelor, niciodată ca autoritate pentru cheia de răspuns. Cheia este păstrată numai dacă răspunsul poate fi verificat independent fără ambiguitate; activarea necesită ulterior confruntarea cu documentul oficial final.

Golurile din numerotare nu se completează prin presupunere.

## QA automat

Banca poate fi verificată local cu:

```bash
node tools/validate-question-bank.mjs
```

Validatorul încarcă atât toate modulele de staging, cât și modulele active declarate în `index.html`. Verifică sintaxa, ID-urile, disciplinele, temele, cele patru variante, `correctIndex`, sursa, explicația, modulele active, aplicarea carantinei și contractele DOM/CSS ale interfeței.

Workflow-ul `.github/workflows/question-bank-qa.yml` execută aceeași verificare automat la fiecare push pe `main` și la pull request. După introducerea loturilor sigure de Istorie 2012, 2015 și 2016, validatorul raportează **16 module verificate, 724 itemi structurali valizi în staging după carantină, 6 module active și 233 itemi activi**. Contractele DOM și CSS trec verificarea.

## GitHub Pages

Repository-ul este compatibil cu publicarea directă din branch-ul `main`, folderul `/ (root)`. Toate căile sunt relative, astfel încât site-ul funcționează corect și sub calea `/admitere/`.

## Verificări funcționale recomandate după modificarea aplicației

1. rularea `node tools/validate-question-bank.mjs`;
2. deschiderea aplicației fără erori în consolă;
3. verificarea numărului de itemi și a listei `QUESTION_AUDIT.skipped`;
4. filtrarea după materie și temă;
5. sesiuni în modurile Învățare, Test și Greșeli;
6. export/import progres;
7. verificare responsive pe mobil.

> Platforma este neoficială și nu este afiliată Administrației Naționale a Penitenciarelor sau Școlii Naționale de Poliție Penitenciară.
