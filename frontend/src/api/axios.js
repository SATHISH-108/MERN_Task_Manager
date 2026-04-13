import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:7001/api";

const API = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (
      err.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes("/users/signin") &&
      !original.url?.includes("/users/refresh")
    ) {
      original._retry = true;
      try {
        await axios.post(
          `${API_BASE}/users/refresh`,
          {},
          { withCredentials: true },
        );
        return API(original);
      } catch (e) {
        try {
          localStorage.removeItem("user");
          localStorage.removeItem("admin");
        } catch {}
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(e);
      }
    }
    return Promise.reject(err);
  },
);

export default API;
