export const localStorageDB = {
  getCart: () => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  },
  setCart: (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
  },
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
  },
  getProducts: () => {
    const products = localStorage.getItem("products");
    return products ? JSON.parse(products) : [];
  },
  setProducts: (products) => {
    localStorage.setItem("products", JSON.stringify(products));
  },
  getProductById: (id) => {
    const products = localStorageDB.getProducts();
    return products.find((product) => product.id === id);
  },
  setProduct: (product) => {
    const products = localStorageDB.getProducts();
    const existingProductIndex = products.findIndex((p) => p.id === product.id);
    if (existingProductIndex !== -1) {
      products[existingProductIndex] = product;
    } else {
      products.push(product);
    }
    localStorageDB.setProducts(products);
  },
  getFinalyShop: () => {
    const finalyShop = localStorage.getItem("finalyShop");
    return finalyShop ? JSON.parse(finalyShop) : { id: 0, user: "", products: [], total: 0 };
  },
  setFinalyShop: (finalyShop) => {
    localStorage.setItem("finalyShop", JSON.stringify(finalyShop));
  },
  clearCart: () => {
    localStorage.removeItem("cart");
  },
  clearUser: () => {
    localStorage.removeItem("user");
  },
  clearFinalyShop: () => {
    localStorage.removeItem("finalyShop");
  }
}