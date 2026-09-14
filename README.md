# Admitere SNPP — Training

Platformă statică, neoficială, pentru pregătirea probei scrise de admitere la Școala Națională de Poliție Penitenciară „Constantin Brâncoveanu” Târgu Ocna.

## Stadiu

Versiunea 1.0.0 conține interfața, tematica furnizată, motorul de testare și progres local. Banca de grile este intenționat goală în `js/questions.js`; întrebările vor fi adăugate după verificarea surselor.

## Tehnologie

- HTML5 + CSS3 + JavaScript fără framework;
- zero backend / zero bază de date;
- progres stocat în `localStorage` (`snpp-training-state-v1`);
- compatibil cu GitHub Pages din rădăcina repository-ului;
- fără dependențe externe și fără build step.

## Structura unei grile

```js
{
  id: "ro-vocab-001",
  subject: "romana", // sau "istorie"
  topic: "vocabular",
  prompt: "Enunțul întrebării",
  options: ["A", "B", "C", "D"],
  correctIndex: 1,
  explanation: "Explicație verificabilă",
  source: "Sursa exactă"
}
```

Motorul validează automat ID-urile duplicate, materia, tema, opțiunile și indexul răspunsului corect. O bancă invalidă nu este încărcată în sesiuni.

## GitHub Pages

Repository-ul poate fi publicat direct din branch-ul `main`, folderul `/ (root)`. Toate căile sunt relative, astfel încât site-ul funcționează corect și sub calea `/admitere/`.

## Verificări recomandate după modificarea grilelor

1. deschiderea aplicației fără erori în consolă;
2. filtrarea după materie și temă;
3. sesiune în modul Învățare;
4. sesiune în modul Test;
5. reluarea greșelilor;
6. export/import progres;
7. verificare responsive pe mobil.

> Platforma este neoficială și nu este afiliată Administrației Naționale a Penitenciarelor sau Școlii Naționale de Poliție Penitenciară.
