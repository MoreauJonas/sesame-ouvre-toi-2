// ORDERS
async function handleOrderSubmit(event) {
  event.preventDefault();
  const inputAi = document.querySelector("#ai-order-input");
  const buttonAi = document.querySelector("#ai-order-form button");
  const messageOrderAi = document.querySelector("#ai-order-message");

  const orderAI = inputAi.value.trim();

  if (
    !validateAiInput(
      orderAI,
      "#ai-order-form button",
      "#ai-order-message",
      messageOrderAi,
    )
  )
    return;

  inputAi.value = "";
  const messages = createMessages(
    `Commande du client : <commande>${orderAI}</commande>`,
    `${orderPrompt}

Prénom actuel : ${JSON.stringify(order.customer)}

- Si aucun nouveau prénom n'est indiqué, conserve le prénom actuel.
- Si aucun prénom n'est connu, retourne "customer": "".
- Si "Doctor" ou "Who" aparaissent passer "exterminate" a "true" 
`,
  );
  htmlResponseAi(
    "#ai-order-form button",
    "#ai-order-message",
    "un Dalek prend votre commande… préparez-vous !",
    true,
  );
  messageOrderAi.classList.remove("is-error");

  try {
    // décommenter pour rendre l'IA indisponible "Produit Introuvable soyez plus précis"
    // throw new Error("Simulation : Dalek ne répond pas");
    const result = await askModel(messages, orderFormat);
    handleExterminate(
      result.exterminate,
      "#ai-order-form button",
      "#ai-order-message",
    );

    // vérification de la réponse du Model

    if (!result.exterminate) {
      renderMenu("all");
      if (controlOrderResult(result)) {
        if (result.lines.length > 0) {
          result.lines.forEach((line) => {
            if (
              line === null ||
              typeof line !== "object" ||
              Array.isArray(line)
            ) {
              htmlResponseAi(
                "#ai-order-form button",
                "#ai-order-message",
                "Produit ...Invalide",
                "is-error",
              );

              return;
            }
            const product = menu.find((item) => item.id === line.id);
            if (product == undefined) {
              htmlResponseAi(
                "#ai-order-form button",
                "#ai-order-message",
                "Produit ...EXTERMINATE",
                "is-error",
              );
              return;
            } else if (!product.available) {
              htmlResponseAi(
                "#ai-order-form button",
                "#ai-order-message",
                `${product.name} a été ...EXTERMINATE !!!  et n'est plus disponible.`,
                "is-error",
              );

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
              htmlResponseAi(
                "#ai-order-form button",
                "#ai-order-message",
                "Vous avez de la chance !!!",
              );
              messageOrderAi.classList.remove("is-error");

              renderTicket();
              return;
            } else {
              htmlResponseAi(
                "#ai-order-form button",
                "#ai-order-message",
                `${line.quantity} ?? il faut revoir les quantitées, je n'ai pas de bras`,
                "is-error",
              );

              return;
            }
          });
          // console.log("Ticket:", order.lines);
        } else {
          htmlResponseAi(
            "#ai-order-form button",
            "#ai-order-message",
            "Produit Introuvable soyez plus précis",
            "is-error",
          );
        }
      }
    }
  } catch (error) {
    htmlResponseAi(
      "#ai-order-form button",
      "#ai-order-message",
      "L'IA ne répond pas : prends la commande à la main, feignasse !",
      "is-error",
    );

    console.error(error);
  } finally {
    buttonAi.disabled = false;
    console.log("order", order);
  }
}
