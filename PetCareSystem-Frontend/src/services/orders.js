import httpClient from "../configs/httpClient";

export const getMyOrders = async (params) => {
  const response = await httpClient.get("/orders", {
    params,
  });

  return response.data;
};

export const getMyOrderDetail = async (orderId) => {
  const response = await httpClient.get(`/orders/${orderId}`);

  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await httpClient.post("/orders", orderData);

  return response.data;
};

export const cancelOrder = async (orderId) => {
  const response = await httpClient.patch(`/orders/${orderId}/cancel`);

  return response.data;
};
