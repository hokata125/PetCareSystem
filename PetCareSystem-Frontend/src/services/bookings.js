import httpClient from "../configs/httpClient";

export const createBooking = async (bookingData) => {
  const response = await httpClient.post("/bookings", bookingData);

  return response.data;
};
