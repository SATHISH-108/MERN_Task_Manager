import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";

// One-time cleanup of legacy tokens (now stored in httpOnly cookies)
localStorage.removeItem("token");
localStorage.removeItem("refreshToken");

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ToastContainer position="top-right" autoClose={1000} />
    <App />
  </AuthProvider>,
);
