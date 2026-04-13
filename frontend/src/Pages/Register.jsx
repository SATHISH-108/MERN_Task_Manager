import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserRegister = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // default to Patient
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/users/signup", user);
      if (response.data.success && (response.status === 201 || response.status === 200)) {
        toast.success(response.data.message);
        setUser({ name: "", email: "", password: "", role: "user" });
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg w-80 shadow">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <form onSubmit={submitHandler}>
          <div>
            <strong>Name</strong>
            <input
              type="text"
              autoComplete="true"
              className="w-full p-2 border mb-2"
              placeholder="Name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>
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
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white w-full p-2 rounded"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserRegister;
