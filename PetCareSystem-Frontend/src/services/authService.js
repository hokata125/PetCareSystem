import httpClient from "../configs/httpClient";

export const login = async (loginData) => {
  const response = await httpClient.post("/auth/login", loginData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await httpClient.get("/users/profile");
  return response.data;
};

export const registerUser = async (registerData) => {
  const response = await httpClient.post("/auth/register", registerData);
  return response.data;
};
