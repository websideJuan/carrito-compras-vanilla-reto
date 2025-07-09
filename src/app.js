import { productsController } from "./controller/products.controller.js";
const app = document.getElementById("app");
const cartIcon = document.querySelector(".cart-icon");
const finalyShop = { id: 0, user: "", products: [], total: 0 };

let currentPage = localStorage.getItem("currentPage") || 0;

console.log(cartIcon);


async function main() {
  const data = await productsController.get();
  app.innerHTML = renderAppHTML();

  listeners(app.parentElement, data);
  renderCard(data[`page_${currentPage}`]);
}

const renderAppHTML = () => {
  return `<div class="container">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <button id="filter-button" style="background-color: white;  color: var(--text-color);">Filtrar</button>
        
        <select id="order-select">
          <option value="default">Ordenar</option>
          <option value="price-asc">Precio: Bajo a Alto</option> 
          <option value="price-desc">Precio: Alto a Bajo</option>
          <option value="rating-asc">Valoración: Bajo a Alto</option>
        </select>
      </div>
      <div class="products">
        
        <div class="filter-nav">
          <p style="margin-bottom: 20px;">Catalogo / Productos</p>
          <div class="filter-products">
            ${["Electronics", "Jewelery", "Men's Clothing", "Women's Clothing"]
              .map(
                (category) => `
              <button class="filter-button" style="background-color: lightgray;" data-category="${category}">${category}</button>
            `
              )
              .join("")}
          </div>
        </div>
        
        <div class="products-filter-content">
            <div class="products-filter">
              <div class="filter-content" style="display: flex; flex-direction: column; gap: 20px;">
                
                <h3>Filtrar por precio</h3>
                <div class="filter-price">
                  <input type="range" id="price-range" min="0" max="1000" step="10" value="500">
                  <p>Rango de precio: $<span id="price-value">500</span></p>
                </div>

                <button id="apply-filters" style="background-color: var(--secondary-color); width: 100%;">Aplicar Filtros</button>
              </div>
            </div>
        </div>

        <ul id="product-list" class="grid"></ul>
  
        <div class="pagination">
          <button id="prev-page">Anterior</button>
          <span id="page-info">Página ${parseInt(currentPage)+ 1} de 5</span>
          <button id="next-page" >Siguiente</button>
        </div>
      </div>

      <div class="cart">
        <div class="cart-content">
          <div class="cart-header">
            <h2>Carrito</h2>
            <button id="clear-cart">Vaciar Carrito</button>
          </div>
          <div class="cart-discount">
            <div class="cart-discount-accordion">
              <label for="discount-checkbox" class="cart-discount-label">
                <input type="checkbox" id="discount-checkbox">
                <p>Descuento: <span id="discount">0%</span></p>
                <i class="fas fa-chevron-up"></i>
              </label>
              <div class="cart-discount-content">
                <div class="discount-code">
                  <input type="text" id="discount-code" placeholder="Código de descuento">
                  <button id="apply-discount">Aplicar</button>
                </div>
              </div>
            </div>
          </div>
          <div class="cart-body">
            <p id="empty-cart-message">
              El carrito está vacío.
            </p>
            <ul id="cart-items" class="cart-items"></ul>
            <p style="margin-top:auto;">Total: $<span id="total-price">0.00</span></p>
          </div>
          <div class="cart-footer">
            <button id="checkout-button" disabled>Finalizar Compra</button>
            <button id="continue-shopping" style="background-color: var(--primary-color);">Continuar Comprando</button>
          </div>
        </div>
      </div>
    </div>`;
};

const listeners = (app, data) =>
  app.addEventListener("click", (event) => renderForClick(event, data));

const renderCurrentPage = (btnText, data) => {
  let currentPage = localStorage.getItem("currentPage") || 0;
  
  if (btnText === "next-page") {
    currentPage++;
    if (currentPage >= Object.keys(data).length) {
      currentPage = 0;
    }
  } else if (btnText === "prev-page") {
    currentPage--;
    if (currentPage < 0) {
      currentPage = Object.keys(data).length - 1;
    }
  }
  localStorage.setItem("currentPage", currentPage);
  const newListCard = data[`page_${currentPage}`];
  renderCard(newListCard);

  const pageinfo = document.getElementById("page-info");
  pageinfo.innerText = `Página ${currentPage + 1} de ${Object.keys(data).length}`;

}

const renderForClick = (event, data) => {
  const cart = document.querySelector(".cart");
  const cratContent = document.querySelector(".cart-content");


  if (event.target.id === "toggleCart") {
    cart.style.display = "block";
    cratContent.classList.add("cart-content-active");
  } else if (event.target.classList.contains("cart")) {
    cart.style.display = "none";
    cratContent.classList.remove("cart-content-active");
  }

  if (event.target.id === "prev-page") renderCurrentPage("prev-page", data);
  if (event.target.id === "next-page") renderCurrentPage("next-page", data);

  if (event.target.classList.contains("add-to-cart")) {
    const button = event.target;
    button.style.opacity = "1";
    button.innerHTML = `
        <div class="update-cart-message" style="display: flex; justify-content: space-between; ">
          <p>-</p>
          <p>1</p>
          <p>+</p>
        </div>
      `;

    addToCart(event.target.dataset.id, data);
  }
};

const addToCart = (id, data) => {
  const forFindProducts = Object.keys(data).reduce((acc, key) => {
    return acc.concat(data[key]);
  }, []);
  const totalPriceElement = document.getElementById("total-price");
  const findProduct = forFindProducts.find(
    (product) => product.id === parseInt(id)
  );

  const product = {
    id: findProduct.id,
    title: findProduct.title,
    image: findProduct.image,
    price: parseFloat(findProduct.price),
    quantity: 1,
  };

  // Check if the product is already in the cart
  const existingProduct = finalyShop.products.find(
    (item) => item.id === product.id
  );
  if (existingProduct) {
    // If the product is already in the cart, increase its quantity
    existingProduct.quantity += 1;
    // Update the price of the existing product
    existingProduct.price =
      parseFloat(element.querySelector("p").innerText.replace("Price: $", "")) *
      existingProduct.quantity;
  } else {
    // If the product is not in the cart, add it
    finalyShop.products.push(product);
  }
  // Update the total price
  finalyShop.total += product.price;
  totalPriceElement.innerText = finalyShop.total.toFixed(2);
  

  const cardBadge = document.createElement("div");
  cardBadge.classList.add("badge", "badge-danger");
  const cartCount = document.createElement("span");
  cartCount.id = "cart-count";
  cartCount.innerText = finalyShop.products.length;
  cardBadge.appendChild(cartCount);

  const existingCartCount = document.getElementById("cart-count");
  if (existingCartCount) {
    existingCartCount.innerText = finalyShop.products.length;
  } else {
    cartIcon.appendChild(cardBadge);
  }
  renderCartItems(finalyShop.products);
};

const renderCartItems = (products) => {
  const cartItems = document.getElementById("cart-items");
  const emptyCartMessage = document.getElementById("empty-cart-message");
  cartItems.innerHTML = "";

  if (products.length === 0) {
    emptyCartMessage.style.display = "block";
    return;
  } else {
    emptyCartMessage.style.display = "none";
  }

  products.forEach((product) => {
    const li = document.createElement("li");
    li.classList.add("cart-item");
    li.innerHTML = `
          <img src="${product.image}" alt="${
      product.title
    }" style="width: 50px; height: 50px;">
          <div>
            <h4>${product.title.split(" ").slice(0, 3).join(" ")}</h4>
            <p>Precio: $${product.price.toFixed(2)}</p>
            <p>Cantidad: ${product.quantity}</p>
            <button class="remove-from-cart" style="background-color: red;" data-id="${
              product.id
            }">
              <i class="fas fa-trash"></i>
            </button>
            <button class="update-quantity" style="background-color: royalblue;" data-id="${
              product.id
            }">
              <i class="fas fa-plus"></i> 
            </button>
          </div>
      `;
    cartItems.appendChild(li);
  });
};

const renderCard = (data) => {
  console.log(data);

  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  data.forEach((product) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="card card-product">
        <div class="product-image">
          <img src="${product.image}" alt="${product.title}">
          <div class="product-rating">
            <span>
              <i class="fa-solid fa-star" style="color: royalblue;"></i> ${
                product.rating.rate
              } (${product.rating.count})
            </span>
          </div>
        </div>
        <div class="product-details">
          <h3>${product.title.split(" ").slice(0, 3).join(" ")}</h3>
          <p>Price: $${product.price}</p>
          <p class="product-description">${product.description
            .split(" ")
            .slice(0, 13)
            .join(" ")}</p>
        </div>
        <button class="add-to-cart" data-id="${product.id}">Comprar</button>
      </div>
      `;
    productList.appendChild(li);
  });
};

window.addEventListener("load", async () => await main());
