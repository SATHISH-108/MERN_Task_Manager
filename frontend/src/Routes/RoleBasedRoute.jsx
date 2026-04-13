import { Navigate } from "react-router-dom";

const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const admin = JSON.parse(localStorage.getItem("admin") || "null");

  const currentUser = user || admin;
  const role = String(currentUser?.role || "").toLowerCase();
  const allowed = allowedRoles.map((r) => String(r).toLowerCase());

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowed.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RoleBasedRoute;
