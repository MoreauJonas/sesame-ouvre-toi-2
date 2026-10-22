function controlAdviceResult(result) {
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
}
