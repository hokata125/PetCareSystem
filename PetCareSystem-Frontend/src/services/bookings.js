import httpClient from "../configs/httpClient";

export const createBooking = async (bookingData) => {
  const response = await httpClient.post("/bookings", bookingData);

  return response.data;
};

export const cancelBooking = async (bookingId) => {
  const response = await httpClient.patch(`/bookings/${bookingId}/cancel`);

  return response.data;
};
