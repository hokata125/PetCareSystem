import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("Chưa cấu hình địa chỉ VITE_API_BASE_URL.");
}

const httpClient = axios.create({ baseURL: apiBaseUrl });

export default httpClient;
