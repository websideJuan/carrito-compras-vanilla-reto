export const getData = async () => {  
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    const newData = data.map((producto) => ({
      ...producto,
      stocktakin: Math.floor(Math.random() * 10),
    }));
    

    // Store the fetched data in localStorage
    return newData;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

