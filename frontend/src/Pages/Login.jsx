import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserLogin = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

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
        navigate(role === "admin" ? "/admin" : "/user", { replace: true });
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-100 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-8 py-7 text-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center text-xl font-bold">
                T
              </div>
              <div>
                <h1 className="text-2xl font-bold leading-tight">
                  Welcome back
                </h1>
                <p className="text-sm text-indigo-100">
                  Sign in to manage your tasks
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={submitHandler} className="px-8 py-7 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                placeholder="you@example.com"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-2.5 pr-16 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                  placeholder="Enter your password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sign in as
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["user", "admin"].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setUser({ ...user, role: r })}
                    className={`py-2.5 rounded-lg text-sm font-medium border transition capitalize ${
                      user.role === r
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-semibold py-2.5 rounded-lg shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-500">
                  New to Task Manager?
                </span>
              </div>
            </div>

            <Link
              to="/register"
              className="block text-center w-full border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-medium py-2.5 rounded-lg transition"
            >
              Create a new account
            </Link>
          </form>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          By signing in you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
