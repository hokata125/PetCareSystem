import httpClient from "../configs/httpClient";

export const getOrderPayment = async (orderId) => {
  const response = await httpClient.get(`/orders/${orderId}/payment`);

  return response.data;
};

export const confirmOrderPayment = async (orderId) => {
  const response = await httpClient.patch(`/orders/${orderId}/payment/confirm`);

  return response.data;
};

export const expireOrderPayment = async (orderId) => {
  const response = await httpClient.patch(`/orders/${orderId}/payment/expire`);

  return response.data;
};

export const getBookingPayment = async (bookingId) => {
  const response = await httpClient.get(`/bookings/${bookingId}/payment`);

  return response.data;
};

export const confirmBookingPayment = async (bookingId) => {
  const response = await httpClient.patch(
    `/bookings/${bookingId}/payment/confirm`,
  );

  return response.data;
};

export const expireBookingPayment = async (bookingId) => {
  const response = await httpClient.patch(
    `/bookings/${bookingId}/payment/expire`,
  );

  return response.data;
};
