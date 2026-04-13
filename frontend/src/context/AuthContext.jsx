import { createContext, useState } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

const safeParse = (data) => {
  try {
    return data && data !== "undefined" ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const getUserFromStorage = () =>
  safeParse(localStorage.getItem("user")) ||
  safeParse(localStorage.getItem("admin"));

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserFromStorage());

  const login = (data) => {
    const profile = data.loginUser || data;
    setUser(profile);
  };

  const logout = async () => {
    try {
      await API.post("/users/logout");
    } catch {}
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
