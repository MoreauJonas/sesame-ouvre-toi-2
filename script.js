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

const menuPrompt = menu
  .map(
    (e) =>
      `id:${e.id}, name:${e.name}, category:${e.category},price:${e.price},available:${e.available}, `,
  )
  .join("|");
// console.log("menu prompt", menuPrompt);

const orderPrompt = `
Voici la carte de Sésame: ${menuPrompt}`;

// Brancher le formulaire
const inputOrderAi = document.querySelector("#ai-order-form");
const inputAi = document.querySelector("#ai-order-input");
const buttonAi = document.querySelector("#ai-order-form button");
const messageOrderAi = document.querySelector("#ai-order-message");

let customer = "";
function createMessages(orderAI) {
  return [
    {
      role: "system",
      content: `${orderPrompt}
      Prénom actuel du client  : ${JSON.stringify(customer)}`,
    },
    {
      role: "user",
      content: `Commande du client : ${orderAI}`,
    },
  ];
}

inputOrderAi.addEventListener("submit", async (event) => {
  event.preventDefault();

  const orderAI = inputAi.value;
  inputAi.value = "";

  const messages = createMessages(orderAI);

  buttonAi.disabled = true;
  messageOrderAi.textContent = "Qwen prend la commande…";
  messageOrderAi.classList.remove("is-error");
  try {
    // throw new Error("Simulation : Ollama ne répond pas");

    const result = await askModel(messages);
    if (result.customer && result.customer.trim() !== "") {
      customer = result.customer;
    }
    console.log("customer", result.customer);
    console.log("customer enregistré ?", customer);
    console.log("result:", result);
    console.log("type:", typeof result);

    if (result.lines.length > 0) {
      result.lines.forEach((line) => {
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
          messageOrderAi.textContent = "EXTERMINATE !!!";
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
      "L'IA ne répond pas : prends la commande à la main, feignasse !";
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
      format: {
        type: "object",
        properties: {
          lines: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string" },
                quantity: { type: "integer" },
              },
              required: ["id", "name", "quantity"],
              additionalProperties: false,
            },
          },
          customer: { type: "string" },
        },
        required: ["lines", "customer"],
        additionalProperties: false,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }
  const result = JSON.parse(data.message.content);

  console.log("Réponse complète Ollama :", result);
  console.log("lines :", result.lines);
  console.log("customer :", result.customer);
  console.log("lines est un tableau ?", Array.isArray(result.lines));
  console.log("customer est une string ?", typeof result.customer);

  if (!Array.isArray(result.lines)) {
    throw new Error("Format invalide : lines doit être un tableau");
  }

  if (typeof result.customer !== "string") {
    throw new Error("Format invalide : customer doit être une string");
  }
  return result;
}
