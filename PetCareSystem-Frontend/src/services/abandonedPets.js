import httpClient from "../configs/httpClient";

export const getAbandonedPets = async (params) => {
  const response = await httpClient.get("/abandoned-pets", {
    params,
  });

  return response.data;
};

export const getAbandonedPetDetail = async (abandonedPetId) => {
  const response = await httpClient.get(`/abandoned-pets/${abandonedPetId}`);

  return response.data;
};
