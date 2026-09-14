# Registru central audit grile

Ultima actualizare: 14.09.2026

Acest director documentează separat verificarea conținutului istoric față de simpla funcționare tehnică a aplicației.

## Reguli de validare

Un item poate intra în banca activă numai dacă sunt îndeplinite cumulativ următoarele condiții:

1. sursa oficială a sesiunii este identificată;
2. enunțul și toate cele patru variante sunt reproduse fidel;
3. cheia este verificată în baremul/grila oficială finală;
4. toate eratele și, dacă sunt relevante, rezultatele contestațiilor au fost verificate;
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
| 2022 | parțial validat; erată Q4 aplicată; itemi ambigui excluși | cheie verificată | da |
| 2021 | cheie verificată; necesită audit normativ 2026 | cheie verificată | nu |
| 2020 | staging; item dependent de subliniere exclus | cheie verificată; Q1 și Q27 excluse pentru erori materiale | nu |
| 2019 | staging; Q35 anulat oficial; 6 itemi dependenți de subliniere excluși | cheie verificată integral | nu |
| 2018 | staging; Q40/Q63 excluse, Q8 neimportat | cheie verificată integral | nu |
| 2017 | staging; Q52 exclus, Q3/Q4/Q6 neimportate | erata Q9 aplicată; audit integral în curs | nu |
| 2016 | neimportat; erată oficială la proba de Limba română identificată | neimportat | nu |
| 2015 | neimportat; surse oficiale identificate | neimportat | nu |

Detaliile și justificările sunt în fișierele `YYYY.md`.

## Carantină tehnică

`js/questions.js` conține `QUARANTINED_QUESTION_IDS`. Un item prezent acolo este ignorat de `registerQuestionBatch()` și nu poate ajunge în `window.QUESTION_BANK`.

Registrul validează acum și structura fiecărei întrebări înainte de înregistrare: format ID, disciplină, temă, enunț, exact patru variante text, `correctIndex` între 0 și 3 și unicitatea ID-ului. O structură invalidă oprește încărcarea în loc să introducă silențios date corupte.

## Politica pentru itemii lipsă

Golurile din numerotare nu se completează prin deducție. Un item lipsă rămâne lipsă până când textul, variantele și cheia pot fi recuperate dintr-o sursă oficială inspectabilă.
