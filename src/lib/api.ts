import axios from "axios";

export const AUTH_TOKEN_NAME = "ns_auth_token";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API || "http://localhost:3005/api",
});

function getAuthToken() {
  return typeof window !== "undefined"
    ? window.localStorage.getItem(AUTH_TOKEN_NAME)
    : null;
}

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default api;
