# Registru central audit grile

Ultima actualizare: 15.09.2026

Acest director documentează separat verificarea conținutului istoric față de simpla funcționare tehnică a aplicației.

## Reguli de validare

Un item poate intra în banca activă numai dacă sunt îndeplinite cumulativ următoarele condiții:

1. sursa oficială a sesiunii este identificată;
2. enunțul și toate cele patru variante sunt reproduse fidel;
3. cheia este verificată în baremul/grila oficială finală;
4. toate eratele și, dacă sunt relevante, rezultatele contestațiilor și corecțiile ulterioare au fost verificate;
5. itemul nu depinde de o formatare pierdută la transcriere (subliniere, grafie distinctivă, accent etc.);
6. nu conține o eroare materială care ar transmite candidatului o informație falsă;
7. pentru Limba română, regula testată este compatibilă cu bibliografia/norma folosită la concursul țintă din 2026;
8. tema se încadrează în tematica concursului țintă.

Baremul istoric dovedește ce a fost punctat la examenul din anul respectiv. Nu este suficient, de unul singur, pentru a transforma automat itemul într-o întrebare validă de pregătire pentru 2026.

## Starea loturilor

| An | Limba română | Istoria românilor | Activ în `index.html` |
|---|---|---|---|
| 2026 | sursa oficială a sesiunii identificată; documentele individuale ANP nu au putut fi inspectate integral | aceeași situație | nu |
| 2025 | neimportat; pagina oficială a sesiunii identificată | neimportat | nu |
| 2024 | neimportat; pagina oficială a sesiunii identificată | neimportat | nu |
| 2023 | barem oficial identificat pe ANP, dar PDF-ul nu a putut fi inspectat integral | barem oficial identificat pe ANP, dar PDF-ul nu a putut fi inspectat integral | nu |
| 2022 | parțial validat; erată Q4 aplicată; Q31/Q33 excluse | cheie verificată | **da** |
| 2021 | **45/45 fidelitate verificată; 39 activi, Q10/Q16/Q19/Q29/Q36/Q39 carantinați** | **30/30 verificați și activi** | **da, ambele discipline** |
| 2020 | staging; Q32/Q43/Q48 excluse după auditul de formatare/normă 2026 | **40/40 fidelitate verificată; 38 activi, Q1/Q27 carantinați** | **da, doar Istorie** |
| 2019 | staging; Q35 anulat oficial; 11 itemi carantinați, inclusiv Q39 după verificarea accentului DOOM 3 | cheia 1–60 verificată; text + variante verificate pentru 13–60; **Q11 carantinat pentru eroare materială privind Convenția de Armistițiu**; 1–12 încă de confruntat vizual | nu |
| 2018 | staging; Q40/Q57/Q63 excluse, Q8 neimportat | cheie verificată integral; fidelitate integrală încă neînchisă | nu |
| 2017 | staging; Q23/Q52 excluse, Q3/Q4/Q6 neimportate | erata Q9 aplicată; audit integral în curs | nu |
| 2016 | neimportat; erata oficială verificată: modifică doar calculul punctajului, nu cheia | sursă oficială identificată; PDF-ul oficial are 6 pagini, dar redarea nu este stabilă | nu |
| 2015 | neimportat; ambele grile oficiale și contestațiile sunt listate în arhivă | neimportat | nu |
| 2014 | neimportat; există și o soluționare ulterioară individuală publicată în 2017 | erată oficială a grilei identificată, conținutul exact încă nerecuperat | nu |
| 2013 | PDF oficial identificat; neimportat | **60/60 recuperați; 57 activi, Q11/Q24/Q35 carantinați** | **da, doar Istorie** |
| 2012 | URL oficial al PDF-ului recuperat; serverul nu l-a redat stabil | URL oficial al PDF-ului recuperat; serverul nu l-a redat stabil | nu |
| 2011 | PDF oficial identificat; redarea paginilor Română a eșuat | grila 1–60 și itemii 1–44 inspectați; 45–60 încă nerecuperați integral | nu |

Detaliile și justificările sunt în fișierele `YYYY.md`.

## Banca activă

Loaderul din `index.html` încarcă, în această ordine:

- `2013-history.js`;
- `2020-history.js`;
- `2021-ro.js`;
- `2021-history.js`;
- `2022-ro.js`;
- `2022-history.js`.

După aplicarea carantinei, banca activă conține **233 de itemi**. Dintre modulele active sunt opriți automat 13 itemi:

`2013-ist-011`, `2013-ist-024`, `2013-ist-035`, `2020-ist-001`, `2020-ist-027`, `2021-ro-010`, `2021-ro-016`, `2021-ro-019`, `2021-ro-029`, `2021-ro-036`, `2021-ro-039`, `2022-ro-031`, `2022-ro-033`.

`2019-ist-011` este, de asemenea, în carantina globală, dar nu afectează numărul de 233 deoarece modulul `2019-history.js` nu este încă activ.

## QA automat

Repository-ul conține `tools/validate-question-bank.mjs` și workflow-ul `.github/workflows/question-bank-qa.yml`.

La fiecare push pe `main` și la fiecare pull request sunt verificate automat:

- sintaxa și încărcarea tuturor modulelor din `js/questions/`;
- formatul și unicitatea ID-urilor;
- disciplina și tema;
- existența enunțului și a exact patru variante nevid;
- `correctIndex`;
- sursa și explicația;
- existența tuturor modulelor declarate active în `index.html`;
- faptul că itemii din carantină nu ajung în banca activă;
- contractul DOM minimal dintre `index.html` și `js/app.js`.

Rularea de după activarea lotului de Limba română 2021 a trecut cu succes: **13 module verificate, 655 itemi structurali valizi în staging după carantină, 6 module active și 233 itemi activi după carantină**. Contractul DOM a trecut de asemenea verificarea automată.

## Carantină tehnică

`js/questions.js` conține `QUARANTINED_QUESTION_IDS`. Un item prezent acolo este ignorat de `registerQuestionBatch()` și nu poate ajunge în `window.QUESTION_BANK`.

Registrul validează structura fiecărei întrebări înainte de înregistrare: format ID, disciplină, temă, enunț, exact patru variante text nevid, `correctIndex` între 0 și 3 și unicitatea ID-ului. O structură invalidă oprește încărcarea în loc să introducă silențios date corupte.

Carantina nu este rezervată numai eratelor oficiale. Ea se aplică și când:

- un marcaj grafic esențial s-a pierdut la transcriere;
- staging-ul conține un text corupt sau ambiguu;
- baremul istoric intră în conflict cu norma actuală relevantă pentru 2026;
- subiectul oficial conține o eroare materială demonstrabilă;
- există două răspunsuri plauzibil/corect acceptabile și nu putem restabili fără echivoc forma originală.

## Politica pentru itemii lipsă

Golurile din numerotare nu se completează prin deducție. Un item lipsă rămâne lipsă până când textul, variantele și cheia pot fi recuperate dintr-o sursă oficială inspectabilă.

Același principiu se aplică anilor pentru care avem numai cheia: nu se creează itemi din memorie, agregatoare, OCR neverificat sau surse secundare.
