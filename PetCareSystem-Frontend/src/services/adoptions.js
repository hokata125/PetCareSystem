import httpClient from "../configs/httpClient";

export const getMyAdoptions = async (params) => {
  const response = await httpClient.get("/adoptions", {
    params,
  });

  return response.data;
};

export const getMyAdoptionDetail = async (adoptionId) => {
  const response = await httpClient.get(`/adoptions/${adoptionId}`);

  return response.data;
};

export const createAdoption = async (adoptionData) => {
  const response = await httpClient.post("/adoptions", adoptionData);

  return response.data;
};

export const cancelAdoption = async (adoptionId) => {
  const response = await httpClient.patch(`/adoptions/${adoptionId}/cancel`);

  return response.data;
};
