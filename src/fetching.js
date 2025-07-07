export const feching = () => {
  let loading = false;
  const getData = async () => {
    const loadingElement = document.createElement("div");
    loadingElement.classList.add("loading");
    try {
      loading = true;
      document.body.appendChild(loadingElement);

      const response = await fetch("https://fakestoreapi.com/products");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const newData = data.map((producto) => ({
        ...producto,
        stocktakin: Math.floor(Math.random() * 10),
      }));
      let indexedData = {};
      let currentPage = 0;

      for (let i = 0; i <= 4; i++) {
        indexedData[`page_${i}`] = newData.slice(currentPage, currentPage + 4);
        currentPage += 4;
      }

      return indexedData;
    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    } finally {
      loading = false;
      loadingElement.remove();
    }
  };

  return {
    getData,
  };
};
