import httpClient from "../configs/httpClient";

export const getServices = async (params) => {
  const response = await httpClient.get("/services", {
    params,
  });

  return response.data;
};
