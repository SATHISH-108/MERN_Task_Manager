import { useState } from "react";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserRegister = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const passwordStrength = (pw) => {
    if (!pw) return { label: "", width: "0%", color: "" };
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const map = [
      { label: "Too short", width: "20%", color: "bg-red-400" },
      { label: "Weak", width: "40%", color: "bg-orange-400" },
      { label: "Fair", width: "60%", color: "bg-yellow-400" },
      { label: "Good", width: "80%", color: "bg-lime-500" },
      { label: "Strong", width: "100%", color: "bg-green-500" },
    ];
    return map[Math.min(score, 5) - 1] || map[0];
  };

  const strength = passwordStrength(user.password);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (user.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const response = await API.post("/users/signup", user);
      if (
        response.data.success &&
        (response.status === 201 || response.status === 200)
      ) {
        toast.success(response.data.message);
        setUser({ name: "", email: "", password: "", role: "user" });
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
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
                  Create your account
                </h1>
                <p className="text-sm text-indigo-100">
                  Start organizing your tasks in minutes
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={submitHandler} className="px-8 py-7 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full name
              </label>
              <input
                type="text"
                required
                autoComplete="name"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                placeholder="Jane Doe"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>

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
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full px-4 py-2.5 pr-16 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                  placeholder="At least 6 characters"
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
              {user.password && (
                <div className="mt-2">
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{strength.label}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Register as
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
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <Link
              to="/login"
              className="block text-center w-full border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-medium py-2.5 rounded-lg transition"
            >
              Sign in instead
            </Link>
          </form>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          By creating an account you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default UserRegister;
