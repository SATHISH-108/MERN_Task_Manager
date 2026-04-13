import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserLogin = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/users/signin", user);
      if (response.data.success && response.status === 200) {
        const loginUser = response.data.loginUser;
        const role = String(loginUser.role || "").toLowerCase();

        localStorage.removeItem("user");
        localStorage.removeItem("admin");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        if (role === "admin") {
          localStorage.setItem("admin", JSON.stringify(loginUser));
        } else {
          localStorage.setItem("user", JSON.stringify(loginUser));
        }

        login({ loginUser });
        toast.success(response.data.message);

        if (role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/user", { replace: true });
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login error");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg w-80 shadow">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <form onSubmit={submitHandler}>
          <div>
            <strong>Email</strong>
            <input
              type="email"
              autoComplete="true"
              className="w-full p-2 border mb-2"
              placeholder="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
          <div>
            <strong>Password</strong>
            <input
              type="password"
              autoComplete="true"
              className="w-full p-2 border mb-2"
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>
          <div>
            <strong>Role</strong>
            <select
              className="w-full p-2 border mb-3"
              value={user.role}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white w-full p-2 rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
