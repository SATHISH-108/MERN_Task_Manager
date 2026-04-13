import axios from "axios";

const API = axios.create({
  baseURL: "https://mern-task-manager-rho-five.vercel.app/api",
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
          "http://localhost:7001/api/users/refresh",
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
