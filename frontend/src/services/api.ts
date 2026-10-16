import axios from "axios";

const hostname = window.location.hostname;

const apiBaseURL = hostname.includes("-5173")
  ? `https://${hostname.replace("-5173", "-5000")}`
  : "http://localhost:5000";

const api = axios.create({
  baseURL: apiBaseURL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;