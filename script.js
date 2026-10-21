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

const formOrderAi = document.querySelector("#ai-order-form");
const inputAi = document.querySelector("#ai-order-input");
const formAdviceAi = document.querySelector("#ai-advice-form");
const inputAdviceAi = document.querySelector("#ai-advice-input");

// message prompt envoyé a cahque commande a Dalek

function createMessages(userMessage, systemPrompt) {
  // console.log(systemPrompt);
  return [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: userMessage,
    },
  ];
}
// END message prompt envoyé a cahque commande a Dalek

// ORDERS
formOrderAi.addEventListener("submit", async (event) => {
  event.preventDefault();
  const buttonAi = document.querySelector("#ai-order-form button");
  const messageOrderAi = document.querySelector("#ai-order-message");

  const orderAI = inputAi.value.trim();
  if (orderAI === "") {
    messageOrderAi.textContent =
      "Veuillez saisir une commande... EXTERMINATE !";
    messageOrderAi.classList.add("is-error");
    return;
  }
  inputAi.value = "";
  const messages = createMessages(
    `Commande du client : <commande>${orderAI}</commande>`,
    `${orderPrompt}

Prénom actuel : ${JSON.stringify(order.customer)}

- Si aucun nouveau prénom n'est indiqué, conserve le prénom actuel.
- Si aucun prénom n'est connu, retourne "customer": "".
`,
  );

  buttonAi.disabled = true;
  messageOrderAi.textContent = "un Dalek prend votre commande… préparez-vous !";
  messageOrderAi.classList.remove("is-error");
  try {
    // décommenter pour rendre l'IA indisponible "Produit Introuvable soyez plus précis"
    // throw new Error("Simulation : Dalek ne répond pas");
    const result = await askModel(messages, orderFormat);
    console.log("exterminate addevent :", result.exterminate);

    if (result.exterminate) {
      console.log("exterminate");
      messageOrderAi.textContent = "Vous avez de la chance !!!!";
      messageOrderAi.classList.remove("is-error");
      renderMenu("all", "exterminate");
    } else {
      console.log("veille");
      // vérification de la réponse du Model

      if (!Array.isArray(result.lines)) {
        throw new Error("Format invalide : lines doit être un tableau");
      }
      if (typeof result.customer !== "string") {
        throw new Error("Format invalide : customer doit être une string");
      }
      // Intégration du nom
      if (result.customer.trim() !== "") {
        order.customer = result.customer.trim();
      }

      // console.log("customer de la commande", result.customer);
      // console.log("customer en mémoire", customer);
      // console.log("result:", result);
      // console.log("type:", typeof result);

      if (result.lines.length > 0) {
        result.lines.forEach((line) => {
          if (
            line === null ||
            typeof line !== "object" ||
            Array.isArray(line)
          ) {
            messageOrderAi.textContent = `Produit ...Invalide`;
            messageOrderAi.classList.add("is-error");
            return;
          }
          const product = menu.find((item) => item.id === line.id);
          if (product == undefined) {
            messageOrderAi.textContent = `Produit ...EXTERMINATE`;
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

            messageOrderAi.textContent = "Vous avez de la chance !!!";
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

// CONSEIL
formAdviceAi.addEventListener("submit", async (event) => {
  event.preventDefault();
  const buttonAi = document.querySelector("#ai-advice-form button");
  const messageOrderAi = document.querySelector("#ai-advice-message");
  const adviceAI = inputAdviceAi.value.trim();

  if (adviceAI === "") {
    messageOrderAi.textContent = "Une envie d'EXTERMINAtion !?";
    messageOrderAi.classList.add("is-error");
    return;
  }
  inputAdviceAi.value = "";

  const messages = createMessages(
    `Commande du client : <demande>${adviceAI}</demande>`,
    `${advicePrompt}

   Prénom actuel : ${JSON.stringify(order.customer)}

   - Si aucun nouveau prénom n'est indiqué, conserve le prénom actuel.
   - Si aucun prénom n'est connu, retourne "customer": "".
   `,
  );
  buttonAi.disabled = true;
  messageOrderAi.textContent = "Dalek en reflexion ...fuyez !";
  messageOrderAi.classList.remove("is-error");
  try {
    // décommenter pour rendre l'IA indisponible "
    // throw new Error("Simulation : Dalek ne répond pas");
    const result = await askModel(messages, adviceFormat);
    console.log("exterminate addevent :", result.exterminate);

    if (result.exterminate) {
      console.log("exterminate");
      messageOrderAi.textContent = "EXTERMINATE !!!!";
      messageOrderAi.classList.remove("is-error");
      renderMenu("all", "exterminate");
    } else {
      console.log("veille");
      // vérification de la réponse du Model
      if (!Array.isArray(result.ids)) {
        throw new Error("Format invalide : ids doit être un tableau");
      }

      if (result.ids.length > 2) {
        throw new Error("Format invalide : maximum 2 produits");
      }

      if (!result.ids.every((id) => Number.isInteger(id))) {
        throw new Error("Format invalide : chaque id doit être un entier");
      }

      if (typeof result.message !== "string") {
        throw new Error("Format invalide : message doit être une string");
      }
      if (result.ids.length > 0) {
        const advisedProducts = result.ids.map((id) =>
          menu.find((product) => product.id === id && product.available),
        );

        // Vérifier que tous les produits existent et sont disponibles
        if (advisedProducts.some((product) => !product)) {
          messageOrderAi.textContent =
            "Produit conseillé inexistant ou indisponible";
          messageOrderAi.classList.add("is-error");
        }
        // Afficher le conseil de Dalek
        messageOrderAi.textContent = result.message;
        // console.log("conseil", result);

        // afficher  les cards recomamdné avec createProductCard(product)

        let adviceProduct = [];
        advisedProducts.forEach((product) => {
          adviceProduct.push(product);
        });
        // console.log("adviceProduct", adviceProduct);
        menuSection.textContent = "";
        advisedProducts.forEach((product) => {
          menuSection.append(createProductCard(product, "is-suggested"));
        });
      } else {
        messageOrderAi.textContent = result.message;
      }
    }
  } catch (error) {
    messageOrderAi.textContent =
      "L'IA ne répond pas : réfléchis par toi même, feignasse !";
    messageOrderAi.classList.add("is-error");
    console.error(error);
  } finally {
    buttonAi.disabled = false;
  }
});
// ============================================================
// 4. Demander une réponse au modèle
// ============================================================
async function askModel(messages, format = orderFormat) {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: messages,
      think: false,
      stream: false,
      format: format,
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
  console.log("exterminate :", result.exterminate);

  return result;
}
