function controlOrderResult(result) {
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
}
