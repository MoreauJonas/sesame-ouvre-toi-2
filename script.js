// Premier affichage
renderMenu("all");
renderTicket();

// La caisse du premier exercice est corrigée dans le dossier register/ (pour partir sur de bonnes bases).
// Tu y touches seulement quand une étape te le demande.

// ============================================================
// L'IA du comptoir. Ton code, une section par étape.
// ============================================================

const formOrderAi = document.querySelector("#ai-order-form");
const formAdviceAi = document.querySelector("#ai-advice-form");

formOrderAi.addEventListener("submit", handleOrderSubmit);
formAdviceAi.addEventListener("submit", handleAdviceSubmit);
