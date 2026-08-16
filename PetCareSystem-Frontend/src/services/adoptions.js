import httpClient from "../configs/httpClient";

export const createAdoption = async (adoptionData) => {
  const response = await httpClient.post("/adoptions", adoptionData);

  return response.data;
};
