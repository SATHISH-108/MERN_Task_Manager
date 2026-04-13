// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const userData = localStorage.getItem("user");
//   const adminData = localStorage.getItem("admin");

//   const user = userData ? JSON.parse(user) : null;
//   const admin = adminData ? JSON.parse(admin) : null;
//   const stored = user || admin;
//   if (!stored) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;

import { Navigate } from "react-router-dom";

const safeParse = (data) => {
  try {
    return data && data !== "undefined" ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const ProtectedRoute = ({ children }) => {
  const user = safeParse(localStorage.getItem("user"));
  const admin = safeParse(localStorage.getItem("admin"));

  const stored = user || admin;

  if (!stored) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
