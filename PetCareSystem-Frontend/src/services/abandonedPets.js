import httpClient from "../configs/httpClient";

export const getAbandonedPets = async (params) => {
  const response = await httpClient.get("/abandoned-pets", {
    params,
  });

  return response.data;
};
