import httpClient from "../configs/httpClient";

export const getMyAdoptions = async (params) => {
  const response = await httpClient.get("/adoptions", {
    params,
  });

  return response.data;
};

export const createAdoption = async (adoptionData) => {
  const response = await httpClient.post("/adoptions", adoptionData);

  return response.data;
};
