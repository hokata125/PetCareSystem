import httpClient from "../configs/httpClient";

export const getProducts = async (params) => {
  const response = await httpClient.get("/products", {
    params,
  });

  return response.data;
};

export const getProductDetail = async (productId) => {
  const response = await httpClient.get(`/products/${productId}`);

  return response.data;
};
