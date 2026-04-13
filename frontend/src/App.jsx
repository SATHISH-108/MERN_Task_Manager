import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, Register, Dashboard, Tasks } from "./Pages/index";
import { Navbar, AdminDashboard, UserDashboard } from "./components/index";
import { ProtectedRoute, RoleBasedRoute } from "./Routes/index";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tasks" element={<Tasks />} />

        <Route path="/register" element={<Register />} />
        {/* USER DASHBOARD => Accessible by User, Admin */}
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["admin", "user"]}>
                <UserDashboard />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
        {/* ADMIN DASHBOARD */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleBasedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </RoleBasedRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
