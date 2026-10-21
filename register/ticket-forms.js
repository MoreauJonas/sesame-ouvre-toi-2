// Les formulaires du ticket : le prénom, le code promo, et l'encaissement.

const customerForm = document.querySelector("#customer-form");
const customerInput = document.querySelector("#customer-name");
const customerError = document.querySelector("#customer-error");

const promoForm = document.querySelector("#promo-form");
const promoInput = document.querySelector("#promo-code");
const promoMessage = document.querySelector("#promo-message");

const checkoutButton = document.querySelector("#checkout");
let ticketNumber = 1;

customerForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = customerInput.value.trim();

  if (name === "") {
    customerError.textContent = "Indique le prénom du client.";
    return;
  }

  order.customer = name;
  customerError.textContent = "";
  renderTicket();
});

// Le seul code que la caisse connaît : BARISTA, −10 %
function applyPromoCode(code) {
  if (code.trim().toUpperCase() === "BARISTA") {
    order.discountRate = 0.1;
    promoMessage.textContent = "−10 % appliqués";
  } else {
    order.discountRate = 0;
    promoMessage.textContent = "Code inconnu";
  }
}

promoForm.addEventListener("submit", function (event) {
  event.preventDefault();
  applyPromoCode(promoInput.value);
  renderTicket();
});

// Vide les champs et les messages du ticket
function clearTicketForms() {
  customerInput.value = "";
  promoInput.value = "";
  customerError.textContent = "";
  promoMessage.textContent = "";
}

checkoutButton.addEventListener("click", function () {
  if (order.lines.length === 0) {
    return;
  }

  alert(
    "Ticket n°" + ticketNumber + " encaissé : " + formatPrice(order.getTotal()),
  );
  ticketNumber++;

  order.reset();
  clearTicketForms();
  renderTicket();
});
