# Admitere SNPP — Training

Platformă statică, neoficială, pentru pregătirea probei scrise de admitere la Școala Națională de Poliție Penitenciară „Constantin Brâncoveanu” Târgu Ocna.

## Stadiu

Aplicația conține interfața, tematica furnizată, motorul de testare, progres local și o bancă modulară de grile istorice aflată în audit.

În versiunea publică sunt încărcate numai loturile 2022 care au trecut filtrul curent de validare. Fișierele 2017–2021 existente în `js/questions/` sunt loturi de staging și nu sunt încărcate de `index.html`. Pentru 2023–2026 nu se importă întrebări până când documentele oficiale relevante nu pot fi inspectate integral.

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
  1,                   // correctIndex: 0..3
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

`QUARANTINED_QUESTION_IDS` din `js/questions.js` blochează itemii pentru care există o problemă materială cunoscută: transcriere ambiguă, formatare esențială pierdută, item oficial defectuos sau alt motiv documentat în audit.

Un item carantinat poate rămâne în fișierul istoric pentru trasabilitate, dar nu ajunge în `window.QUESTION_BANK` și nu poate apărea într-o sesiune de antrenament.

## Regula de includere

Faptul că un răspuns apare într-un barem istoric nu este suficient pentru activare. Pentru publicare se verifică, în principiu: sursa oficială, fidelitatea enunțului și variantelor, cheia finală, eratele/contestațiile, eventualele marcaje grafice și compatibilitatea cu tematica și bibliografia concursului țintă.

Golurile din numerotare nu se completează prin deducție sau din surse neoficiale.

## GitHub Pages

Repository-ul poate fi publicat direct din branch-ul `main`, folderul `/ (root)`. Toate căile sunt relative, astfel încât site-ul funcționează corect și sub calea `/admitere/`.

## Verificări recomandate după modificarea grilelor

1. deschiderea aplicației fără erori în consolă;
2. verificarea numărului de itemi înregistrați și a listei `QUESTION_AUDIT.skipped`;
3. filtrarea după materie și temă;
4. sesiune în modul Învățare;
5. sesiune în modul Test;
6. reluarea greșelilor;
7. export/import progres;
8. verificare responsive pe mobil.

> Platforma este neoficială și nu este afiliată Administrației Naționale a Penitenciarelor sau Școlii Naționale de Poliție Penitenciară.
