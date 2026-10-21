const MODEL_NAME = "dalek";
const OLLAMA_URL = "http://localhost:11434/api/chat";

// Premier affichage
renderMenu("all");
renderTicket();

// La caisse du premier exercice est corrigée dans le dossier register/ (pour partir sur de bonnes bases).
// Tu y touches seulement quand une étape te le demande.

// ============================================================
// L'IA du comptoir. Ton code, une section par étape.
// ============================================================

const inputOrderAi = document.querySelector("#ai-order-form");
const inputAi = document.querySelector("#ai-order-input");
const buttonAi = document.querySelector("#ai-order-form button");
const messageOrderAi = document.querySelector("#ai-order-message");

// message prompt envoyé a cahque commande a Dalek

const menuPrompt = menu
  .map(
    (e) =>
      `id:${e.id}, name:${e.name}, category:${e.category},price:${e.price},available:${e.available}, `,
  )
  .join("|");
// console.log("menu prompt", menuPrompt);
const orderPrompt = `
CARTE DU CAFÉ (référence uniquement) :
<menu>
${menuPrompt}
</menu>

INSTRUCTIONS :
- La carte n'est pas une commande.
- Identifie uniquement les produits mentionnés dans le message utilisateur.
- Aucun produit mentionné = "lines": [].
- N'invente jamais de produits.
`;

function createMessages(orderAI) {
  return [
    {
      role: "system",
      content: `${orderPrompt}

Prénom actuel : ${JSON.stringify(order.customer)}

- Si aucun nouveau prénom n'est indiqué, conserve le prénom actuel.
- Si aucun prénom n'est connu, retourne "customer": "".
`,
    },
    {
      role: "user",
      content: `Commande du client : <commande>${orderAI}</commande>`,
    },
  ];
}
// END message prompt envoyé a cahque commande a Dalek

inputOrderAi.addEventListener("submit", async (event) => {
  event.preventDefault();

  const orderAI = inputAi.value.trim();
  if (orderAI === "") {
    messageOrderAi.textContent =
      "Veuillez saisir une commande... EXTERMINATE !";
    messageOrderAi.classList.add("is-error");
    return;
  }
  inputAi.value = "";

  const messages = createMessages(orderAI);

  buttonAi.disabled = true;
  messageOrderAi.textContent = "un Dalek prend votre commande… préparez-vous !";
  messageOrderAi.classList.remove("is-error");
  try {
    // décommenter pour rendre l'IA indisponible "Produit Introuvable soyez plus précis"
    // throw new Error("Simulation : Dalek ne répond pas");

    const result = await askModel(messages);
    if (result.customer && result.customer.trim() !== "") {
      customer = result.customer;
    }

    // intégration du nom
    // const name = customer;
    // order.customer = name;
    if (result.customer.trim() !== "") {
      order.customer = result.customer;
    }

    // console.log("customer de la commande", result.customer);
    // console.log("customer en mémoire", customer);
    // console.log("result:", result);
    // console.log("type:", typeof result);

    if (result.lines.length > 0) {
      result.lines.forEach((line) => {
        if (line === null || typeof line !== "object" || Array.isArray(line)) {
          messageOrderAi.textContent = `${product.name} - Produit ...Invalide`;
          messageOrderAi.classList.add("is-error");
          return;
        }
        const product = menu.find((item) => item.id === line.id);
        if (product == undefined) {
          messageOrderAi.textContent = `${product.name} - Produit ...EXTERMINATE`;
          messageOrderAi.classList.add("is-error");
          return;
        } else if (!product.available) {
          messageOrderAi.textContent = `${product.name} a été ...EXTERMINATE !!!  et n'est plus disponible.`;
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
          s;
          messageOrderAi.textContent = "EXTERMINATE !!!";
          renderTicket();
          return;
        } else {
          messageOrderAi.textContent = `${line.quantity} ?? il faut revoir les quantitées, je n'ai pas de bras`;
          messageOrderAi.classList.add("is-error");
          return;
        }
      });
      // console.log("Ticket:", order.lines);
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
    console.log("order", order);
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
      // format imposé en réponse
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

  // console.log("Réponse complète Ollama :", result);
  // console.log("lines :", result.lines);
  // console.log("customer :", result.customer);

  if (!Array.isArray(result.lines)) {
    throw new Error("Format invalide : lines doit être un tableau");
  }

  if (typeof result.customer !== "string") {
    throw new Error("Format invalide : customer doit être une string");
  }
  return result;
}
