import httpClient from "../configs/httpClient";

export const updateProfile = async (profileData) => {
  const response = await httpClient.patch("/users/profile", profileData);
  return response.data;
};

export const updateAvatar = async (avatarFile) => {
  const avatarData = new FormData();
  avatarData.append("avatar_file", avatarFile);

  const response = await httpClient.patch("/users/profile/avatar", avatarData);

  return response.data;
};
