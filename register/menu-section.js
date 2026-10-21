// La carte : une carte par produit, et le filtre par catégorie.

const menuSection = document.querySelector("#menu");
const categories = document.querySelector("#categories");

function categoryLabel(category) {
  if (category === "coffee") {
    return "Café";
  }
  if (category === "tea") {
    return "Thé & autres";
  }
  if (category === "pastry") {
    return "Pâtisserie";
  }
  return category;
}

// Crée la carte d'un produit, sur le modèle en commentaire dans index.html
function createProductCard(product, className = "") {
  const card = document.createElement("article");
  card.classList.add("product");
  // pour intégrer une classe au card conseillé par le Model
  if (className) {
    card.classList.add(className);
  }
  const categorySpan = document.createElement("span");
  categorySpan.classList.add("product-category");
  categorySpan.textContent = categoryLabel(product.category);

  const name = document.createElement("h3");
  name.classList.add("product-name");
  name.textContent = product.name;

  const price = document.createElement("p");
  price.classList.add("product-price");
  price.textContent = formatPrice(product.price);

  const button = document.createElement("button");
  button.type = "button";
  button.classList.add("product-add");
  button.textContent = "Ajouter";

  if (product.available === false) {
    card.classList.add("is-sold-out");
    button.disabled = true;
  }

  button.addEventListener("click", function () {
    order.add(product);
    renderTicket();
  });

  card.append(categorySpan, name, price, button);
  return card;
}

// Vide la carte, puis la redessine : tout, ou une seule catégorie
function renderMenu(category) {
  menuSection.textContent = "";

  const products = menu.filter(
    (product) => category === "all" || product.category === category,
  );
  products.forEach((product) => {
    menuSection.append(createProductCard(product));
  });
}

// Le bouton cliqué devient le seul actif
function setActiveCategory(clickedButton) {
  categories.querySelectorAll("button").forEach((button) => {
    button.classList.remove("is-active");
  });
  clickedButton.classList.add("is-active");
}

categories.addEventListener("click", function (event) {
  if (event.target.tagName !== "BUTTON") {
    return;
  }
  setActiveCategory(event.target);
  renderMenu(event.target.value);
});
