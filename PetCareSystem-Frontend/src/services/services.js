import httpClient from "../configs/httpClient";

export const getServices = async (params) => {
  const response = await httpClient.get("/services", {
    params,
  });

  return response.data;
};

export const getServiceDetail = async (serviceId) => {
  const response = await httpClient.get(`/services/${serviceId}`);

  return response.data;
};
