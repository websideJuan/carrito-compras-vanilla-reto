import { feching } from "./fetching.js";
const app = document.getElementById("app");

const finalyShop = { id: 0, user: "", products: [], total: 0 };
let currentPage = 0;

const { getData } = feching();
document.addEventListener("DOMContentLoaded", async () => {
  const data = await getData();
  console.log("Data loaded:", data);
  
  renderAppContent();
  renderCard(data[`page_${currentPage}`]);
});

const renderAppContent = () => {
  app.innerHTML = `
    <div class="container">
      <div style="padding: 20px;  box-shadow: 0 0 10px  rgba(0 0 0 / .2); display: flex; justify-content: space-between; align-items: center;">
        <button id="filter-button" style="background-color: white;  color: var(--text-color);">Filtrar</button>
        
        <select id="order-select" style="width:100px;">
          <option value="default">Ordenar</option>
          <option value="price-asc">Precio: Bajo a Alto</option> 
          <option value="price-desc">Precio: Alto a Bajo</option>
          <option value="rating-asc">Valoración: Bajo a Alto</option>
        </select>
      </div>
      <div class="products">
        <ul id="product-list" class="grid"></ul>

        <div class="pagination">
          <button id="prev-page">Anterior</button>
          <span id="page-info">Página 1 de 5</span>
          <button id="next-page" >Siguiente</button>
        </div>
      </div>
      <div class="cart">
        <div class="cart-content">
          <div class="cart-header">
            <h2>Carrito</h2>
            <button id="clear-cart">Vaciar Carrito</button>
          </div>
          <div class="cart-body">
            <p id="empty-cart-message">El carrito está vacío.</p>
            <ul id="cart-items" class="cart-items"></ul>
            <p style="margin-top:auto;">Total: $<span id="total-price">0.00</span></p>
          </div>
          <div class="cart-footer">
            <button id="checkout-button" disabled>Finalizar Compra</button>
            <button id="continue-shopping">Continuar Comprando</button>
          </div>
        </div>
      </div>
    </div>
  `;
  // Aquí puedes agregar más lógica para cargar productos y manejar el carrito

  listeners(app.parentElement);
};

const listeners = (app) => {
  app.addEventListener("click", (event) => renderForClick(event));
};

const renderForClick = async (event) => {
  const cart = document.querySelector(".cart");
  const cratContent = document.querySelector(".cart-content");
  const pageinfo = document.getElementById("page-info");

  if (event.target.id === "toggleCart") {
    cart.style.display = "block";
    cratContent.classList.add("cart-content-active");
  } else if (event.target.classList.contains("cart")) {
    cart.style.display = "none";
    cratContent.classList.remove("cart-content-active");
  }

  if (event.target.id === "prev-page") {
    currentPage--;

    const data = await getData();
    if (currentPage < 0) {
      currentPage = Object.keys(data).length - 1;
    }
    
    const newListCard = data[`page_${currentPage}`];
    
    renderCard(newListCard);
    pageinfo.innerText = `Página ${currentPage + 1} de ${Object.keys(data).length}`;
  }

  if (event.target.id === "next-page") {
    currentPage++;

    const data = await getData();
    if (currentPage >= Object.keys(data).length) {
      currentPage = 0;
    }

    const newListCard = data[`page_${currentPage}`];
    renderCard(newListCard);
    pageinfo.innerText = `Página ${currentPage + 1} de ${Object.keys(data).length}`;
  }

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
    button.disabled = true;
    addToCart(event.target.parentElement);
  }
};

const addToCart = (element) => {
  const totalPriceElement = document.getElementById("total-price");

  const product = {
    id: element.querySelector(".add-to-cart").dataset.id,
    title: element.querySelector("h3").innerText,
    price: parseFloat(
      element.querySelector("p").innerText.replace("Price: $", "")
    ),
    image: element.querySelector("img").src,
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
    existingProduct.price = parseFloat(
      element.querySelector("p").innerText.replace("Price: $", "")
    ) * existingProduct.quantity;
  } else {
    // If the product is not in the cart, add it
    finalyShop.products.push(product);
  }
  // Update the total price
  finalyShop.total += product.price;
  totalPriceElement.innerText = finalyShop.total.toFixed(2);

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
          <button class="remove-from-cart" data-id="${
            product.id
          }">Eliminar</button>
          <button class="update-quantity" data-id="${
            product.id
          }">Actualizar</button>
        </div>
    `;
    cartItems.appendChild(li);
  });
};

const renderCard = (data) => {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  data.forEach((product) => {
    const li = document.createElement("li");
    li.className = "card card-product";
    li.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.title}">
        <div class="product-rating">
          <span>⭐ ${product.rating.rate} (${product.rating.count})</span>
        </div>
      </div>
      <div class="product-details">
        <h3>${product.title.split(" ").slice(0, 3).join(" ")}</h3>
        <p>Price: $${product.price}</p>
        <p class="product-description">${product.description.split(" ").slice(0, 13).join(" ")}</p>
      </div>
      <button class="add-to-cart" data-id="${product.id}">Comprar</button>
    `;
    productList.appendChild(li);
  });
};
