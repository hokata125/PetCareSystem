import httpClient from "../../../api/httpClient";

export const login = async (loginData) => {
  const response = await httpClient.post("/auth/login", loginData);
  return response.data;
};
