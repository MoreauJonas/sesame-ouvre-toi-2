// La commande en cours : ce qu'il y a sur le ticket, sans rien afficher.

// Transforme 220 en "2,20 €".
function formatPrice(cents) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

const order = {
  customer: "",
  lines: [],
  discountRate: 0,

  // La ligne de ce produit, ou undefined s'il n'est pas encore sur le ticket
  findLine(id) {
    return this.lines.find((line) => line.id === id);
  },

  add(product) {
    const line = this.findLine(product.id);
    if (line !== undefined) {
      line.quantity++;
      return;
    }
    this.lines.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  },

  remove(id) {
    const line = this.findLine(id);
    if (line === undefined) {
      return;
    }
    line.quantity--;
    if (line.quantity === 0) {
      this.lines = this.lines.filter((other) => other.id !== id);
    }
  },

  getSubtotal() {
    return this.lines.reduce(
      (sum, line) => sum + line.price * line.quantity,
      0,
    );
  },

  getDiscount() {
    return Math.round(this.getSubtotal() * this.discountRate);
  },

  getTotal() {
    return this.getSubtotal() - this.getDiscount();
  },

  // Un ticket vierge, pour le client suivant
  reset() {
    this.customer = "";
    this.lines = [];
    this.discountRate = 0;
  },
};
