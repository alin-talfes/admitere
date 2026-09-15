# Registru central audit grile

Ultima actualizare: 15.09.2026

Acest director documentează separat verificarea conținutului față de simpla funcționare tehnică a aplicației.

Auditul semantic transversal realizat la 15.09.2026 este documentat în [`semantic-2026-09-15.md`](semantic-2026-09-15.md). Acesta verifică în special compatibilitatea grilelor istorice de Limba română cu DOOM3 și cu gramatica actuală din bibliografia 2026 și face un control material suplimentar al itemilor de Istorie.

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
| 2026 | sursa oficială a sesiunii identificată; documentele individuale ANP nu au fost încă inspectate integral | aceeași situație | nu |
| 2025 | neimportat; pagina oficială a sesiunii identificată | neimportat | nu |
| 2024 | neimportat; pagina oficială a sesiunii identificată | neimportat | nu |
| 2023 | barem oficial identificat pe ANP, dar PDF-ul nu a putut fi inspectat integral | barem oficial identificat pe ANP, dar PDF-ul nu a putut fi inspectat integral | nu |
| 2022 | parțial validat; erată Q4 aplicată; Q31/Q33/Q42 carantinate | cheie verificată; 30/30 activi | **da** |
| 2021 | **45/45 fidelitate verificată; 39 activi, Q10/Q16/Q19/Q29/Q36/Q39 carantinați** | **30/30 verificați și activi** | **da, ambele discipline** |
| 2020 | staging; audit semantic extins: Q8/Q9/Q15/Q32/Q34/Q43/Q45/Q48 carantinate | **40/40 fidelitate verificată; 38 activi, Q1/Q27 carantinați** | **da, doar Istorie** |
| 2019 | staging; Q35 anulat oficial; Q23/Q66 adăugați la carantina semantică, pe lângă itemii deja blocați | cheia 1–60 verificată; text + variante 13–60; Q11 și Q60 carantinate; 1–12 încă de confruntat vizual | nu |
| 2018 | staging; Q8 neimportat; Q14/Q35/Q40/Q45/Q51/Q53/Q57/Q63/Q67 carantinate | cheie verificată integral; fidelitate integrală încă neînchisă | nu |
| 2017 | staging; Q3/Q4/Q6 neimportate; Q23/Q41/Q45/Q52/Q69 carantinate | erata Q9 aplicată; audit integral în curs | nu |
| 2016 | neimportat la Română; erata oficială verificată: modifică doar calculul punctajului, nu cheia | lot staging; sursă oficială identificată; audit de fidelitate neînchis | nu |
| 2015 | neimportat la Română; grilele oficiale și contestațiile sunt listate în arhivă | lot staging conservator; audit de fidelitate neînchis | nu |
| 2014 | neimportat; există și o soluționare ulterioară individuală publicată în 2017 | erată oficială identificată, conținutul exact încă nerecuperat | nu |
| 2013 | PDF oficial identificat; neimportat | **60/60 recuperați; 57 activi, Q11/Q24/Q35 carantinați** | **da, doar Istorie** |
| 2012 | URL oficial recuperat; Româna neimportată | 24 itemi staging conservator; Q46 carantinat semantic | nu |
| 2011 | PDF oficial identificat; redarea paginilor Română a eșuat | itemii 1–44 recuperați conservator; 45–60 încă nerecuperați integral | nu |

Detaliile istorice sunt în fișierele `YYYY.md`, iar motivele noilor excluderi transversale sunt centralizate în `semantic-2026-09-15.md`.

## Banca activă după auditul semantic din 15.09.2026

Loaderul din `index.html` încarcă, în această ordine:

- `2013-history.js`;
- `2020-history.js`;
- `2021-ro.js`;
- `2021-history.js`;
- `2022-ro.js`;
- `2022-history.js`.

Rularea QA pentru commitul de audit semantic a confirmat:

- **17 module totale verificate**;
- **6 module active**;
- **745 itemi structurali valizi în staging după carantină**;
- **232 itemi activi după carantină**;
- **14 itemi carantinați întâlniți în modulele active**.

Carantina activă este:

`2013-ist-011`, `2013-ist-024`, `2013-ist-035`, `2020-ist-001`, `2020-ist-027`, `2021-ro-010`, `2021-ro-016`, `2021-ro-019`, `2021-ro-029`, `2021-ro-036`, `2021-ro-039`, `2022-ro-031`, `2022-ro-033`, `2022-ro-042`.

Față de banca activă anterioară de 233 de itemi, auditul semantic a eliminat suplimentar numai `2022-ro-042`. Celelalte excluderi noi se află în module staging și previn activarea lor prematură.

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
- contractul DOM dintre `index.html` și `js/app.js`;
- contractul CSS/tema pentru clasele critice ale interfeței.

Rularea din 15.09.2026 pentru commitul `b04d3a766852facb1b5a459bb438bf5e6ed02472` a trecut cu succes. Au trecut și contractele DOM (59 ID-uri, 52 selectori, 13 listenere directe, 13 clase dinamice) și CSS (42 clase critice, 95 clase CSS detectate).

## Carantină tehnică

`js/questions.js` conține `QUARANTINED_QUESTION_IDS`. Un item prezent acolo este ignorat de `registerQuestionBatch()` și nu poate ajunge în `window.QUESTION_BANK`.

Registrul validează structura fiecărei întrebări înainte de înregistrare: format ID, disciplină, temă, enunț, exact patru variante text nevid, `correctIndex` între 0 și 3 și unicitatea ID-ului. O structură invalidă oprește încărcarea în loc să introducă silențios date corupte.

Carantina se aplică atunci când:

- un marcaj grafic esențial s-a pierdut la transcriere;
- staging-ul conține un text corupt sau ambiguu;
- baremul istoric intră în conflict cu norma actuală relevantă pentru 2026;
- subiectul oficial conține o eroare materială demonstrabilă;
- există două răspunsuri corecte/plauzibile sau niciun răspuns integral corect;
- analiza gramaticală cerută folosește o categorie abandonată/reclasificată de bibliografia actuală și ar preda candidatului o regulă depășită.

## Politica pentru itemii lipsă

Golurile din numerotare nu se completează prin deducție. Un item lipsă rămâne lipsă până când textul, variantele și cheia pot fi recuperate dintr-o sursă oficială inspectabilă.

Același principiu se aplică anilor pentru care avem numai cheia: nu se creează itemi din memorie, agregatoare, OCR neverificat sau surse secundare.
