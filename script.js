const MODEL_NAME = "dalek";
const OLLAMA_URL = "http://localhost:11434/api/chat";
// La caisse du premier exercice est corrigée dans le dossier register/ (pour partir sur de bonnes bases).
// Tu y touches seulement quand une étape te le demande.

// ============================================================
// L'IA du comptoir. Ton code, une section par étape.
// ============================================================

// Étape 1 · Parler à Qwen

// Étape 2 · La carte dans le prompt système

// Étape 3 · Une réponse en JSON

// Étape 4 · Le ticket se remplit

// Étape 5 · La caisse décide

// Étape 6 · Quand l'IA ne répond pas

// Étape 7 · Le prénom aussi

// Étape 8 · Le conseil du barista

// Bonus

// Premier affichage
renderMenu("all");
renderTicket();

// PROMPT SYSTEM
const menuPrompt = menu
  .map(
    (e) =>
      `id:${e.id}, name:${e.name}, category:${e.category},price:${e.price},available:${e.available} `,
  )
  .join("|");
// console.log("menu prompt", menuPrompt);

const orderPrompt = `
Tu es le barista du café Sésame.
Tu analyses les commandes des clients en utilisant uniquement la carte du café.

Voici la carte :
${menuPrompt}

RÈGLES :
- Identifie les produits demandés par le client.
- Utilise uniquement les produits présents dans la carte.
- Pour chaque produit, retourne son id, son name et sa quantity.
- id et quantity sont des nombres entiers.
- name est une chaîne de caractères.
- Si un produit est commandé plusieurs fois, regroupe-le sur une seule ligne avec la quantité totale.
- Si aucune correspondance n'est trouvée, retourne un tableau lines vide.
- N'invente jamais de produits ou d'identifiants.

RÈGLES SUR LES QUANTITÉS :
- Conserve exactement la quantité demandée par le client.
- Ne modifie jamais une quantité pour respecter une limite.
- Si le client demande 400 expressos, retourne quantity: 400.
- Ne limite jamais automatiquement une quantité à 10.
- La validation des quantités sera effectuée par JavaScript.

FORMAT DE RÉPONSE :
- Réponds uniquement avec un objet JSON valide.
- L'objet doit contenir une seule propriété : "lines".
- "lines" doit être un tableau d'objets.
- N'ajoute aucun texte, commentaire ou balise Markdown.
- N'utilise pas de bloc \`\`\`json.

QAUND TU AS TERMINE
- relis et vérifis ta réponse
`;

// Brancher le formulaire
const inputOrderAi = document.querySelector("#ai-order-form");
const inputAi = document.querySelector("#ai-order-input");
const buttonAi = document.querySelector("#ai-order-form button");
const messageOrderAi = document.querySelector("#ai-order-message");

inputOrderAi.addEventListener("submit", async (event) => {
  event.preventDefault();

  const orderAI = inputAi.value;
  inputAi.value = "";

  const messages = [
    { role: "system", content: orderPrompt },
    { role: "user", content: orderAI },
  ];
  buttonAi.disabled = true;
  messageOrderAi.textContent = "Qwen prend la commande…";
  messageOrderAi.classList.remove("is-error");
  try {
    // throw new Error("Simulation : Ollama ne répond pas");

    const result = await askModel(messages);
    console.log("result:", result);
    console.log("type:", typeof result);
    if (Array.isArray(result) && result.length > 0) {
      result.forEach((line) => {
        if (line === null || typeof line !== "object" || Array.isArray(line)) {
          messageOrderAi.textContent = "Produit invalide";
          messageOrderAi.classList.add("is-error");
          return;
        }
        const product = menu.find((item) => item.id === line.id);
        if (product == undefined) {
          messageOrderAi.textContent = "Produit Introuvable";
          messageOrderAi.classList.add("is-error");
          return;
        } else if (!product.available) {
          messageOrderAi.textContent = "Produit épuisé";
          messageOrderAi.classList.add("is-error");
          return;
        }

        if (
          Number.isInteger(line.quantity) &&
          line.quantity <= 10 &&
          line.quantity > 0
        ) {
          for (let i = 0; i < line.quantity; i++) {
            order.add(product);
          }
          messageOrderAi.textContent = "Over";
          renderTicket();
          return;
        } else {
          messageOrderAi.textContent = "Revoir les quantité";
          messageOrderAi.classList.add("is-error");
          return;
        }
      });
      console.log("Ticket:", order.lines);
    } else {
      messageOrderAi.textContent = "Produit Introuvable soyez plus précis";
      messageOrderAi.classList.add("is-error");
    }
  } catch (error) {
    messageOrderAi.textContent =
      "L'IA ne répond pas : prends la commande à la main";
    messageOrderAi.classList.add("is-error");
    console.error(error);
  } finally {
    buttonAi.disabled = false;
  }
});

// ============================================================
// 4. Demander une réponse au modèle
// ============================================================
async function askModel(messages) {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: messages,
      think: false,
      stream: false,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }

  return JSON.parse(data.message.content);
}
