import httpClient from "../configs/httpClient";

export const updateProfile = async (profileData) => {
  const response = await httpClient.patch("/users/profile", profileData);
  return response.data;
};
