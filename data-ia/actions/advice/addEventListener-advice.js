// ADVICE
async function handleAdviceSubmit(event) {
  event.preventDefault();
  const buttonAi = document.querySelector("#ai-advice-form button");
  const messageOrderAi = document.querySelector("#ai-advice-message");
  const inputAdviceAi = document.querySelector("#ai-advice-input");
  const mainContain = document.querySelector("main");

  const adviceAI = inputAdviceAi.value.trim();

  if (adviceAI === "") {
    htmlResponseAi(
      "#ai-advice-form button",
      "#ai-advice-message",
      "Une envie d'EXTERMINAtion !?",
    );
    messageOrderAi.classList.remove("is-error");

    return;
  }
  inputAdviceAi.value = "";

  const messages = createMessages(
    `Commande du client : <demande>${adviceAI}</demande>`,
    `${advicePrompt}

   Prénom actuel : ${JSON.stringify(order.customer)}

   - Si aucun nouveau prénom n'est indiqué, conserve le prénom actuel.
   - Si aucun prénom n'est connu, retourne "customer": "".
   - Si "Doctor" ou "Who" aparaissent passer "exterminate" a "true". 
   `,
  );
  htmlResponseAi(
    "#ai-advice-form button",
    "#ai-advice-message",
    "Dalek en reflexion ...fuyez !",
    true,
  );
  messageOrderAi.classList.remove("is-error");

  try {
    // décommenter pour rendre l'IA indisponible "
    // throw new Error("Simulation : Dalek ne répond pas");
    const result = await askModel(messages, adviceFormat);

    if (result.exterminate) {
      htmlResponseAi(
        "#ai-advice-form button",
        "#ai-advice-message",
        "Doctor Who detecté ...EXTERMINATE !!!!",
        "is-error",
      );
      mainContain.classList.add("exterminate-main");

      renderMenu("all", "exterminate");
    } else {
      mainContain.classList.remove("exterminate-main");
      renderMenu("all");
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
          htmlResponseAi(
            "#ai-advice-form button",
            "#ai-advice-message",
            "Produit conseillé inexistant ou indisponible",
            "is-error",
          );
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
    htmlResponseAi(
      "#ai-advice-form button",
      "#ai-advice-message",
      "L'IA ne répond pas : réfléchis par toi même, feignasse !",
      "is-error",
    );

    console.error(error);
  } finally {
    buttonAi.disabled = false;
  }
}
