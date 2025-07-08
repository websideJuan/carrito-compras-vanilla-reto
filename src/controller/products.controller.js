import { getData } from "../dataBase/fetching.js";
import { localStorageDB } from "../dataBase/localStorage.js";

export const productsController = {
  products: localStorageDB.getProducts() || [],
  async get() {
    try {
      const data = await getData();

      if (!data || Object.keys(data).length === 0) {
        console.warn("No products found");
        return [];
      }

      let indexedData = {};
      let currentPage = 0;

      for (let i = 0; i <= 4; i++) {
        indexedData[`page_${i}`] = data.slice(currentPage, currentPage + 4);
        currentPage += 4;
      }

      localStorageDB.setProducts(indexedData);

      return this.products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  async getByCategory(category) {
    try {
      const data = await getData();
      if (!data || Object.keys(data).length === 0) {
        console.warn("No products found");
        return [];
      }

      const filteredProducts = data.filter(
        (product) => product.category === category
      );

      if (filteredProducts.length === 0) {
        console.warn(`No products found in category: ${category}`);
        return [];
      }

      localStorageDB.setProducts(filteredProducts);
      this.products = filteredProducts;
      return filteredProducts;
    } catch (error) {
      console.error("Error fetching products by category:", error);
      return [];
    }
  },
};
