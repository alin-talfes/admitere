/**
 * Banca de grile pentru Admitere SNPP Training.
 *
 * Fiecare întrebare trebuie să respecte schema:
 * {
 *   id: "ro-vocab-001",                    // unic, stabil
 *   subject: "romana" | "istorie",
 *   topic: "vocabular",                    // cheie de temă existentă în app.js
 *   prompt: "Enunțul întrebării",
 *   options: ["Varianta A", "Varianta B", "Varianta C", "Varianta D"],
 *   correctIndex: 1,                        // index 0-based; exact un răspuns corect
 *   explanation: "Explicație scurtă și verificabilă.",
 *   source: "Sursa / pagina / norma bibliografică"
 * }
 *
 * Nu există întrebări demonstrative în versiunea inițială. Banca va fi populată
 * ulterior numai cu grile verificate.
 */
window.QUESTION_BANK = [];
