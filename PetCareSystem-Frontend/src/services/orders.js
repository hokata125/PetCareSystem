import httpClient from "../configs/httpClient";

export const createOrder = async (orderData) => {
  const response = await httpClient.post("/orders", orderData);

  return response.data;
};
