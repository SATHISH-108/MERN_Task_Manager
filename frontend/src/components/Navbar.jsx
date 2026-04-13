import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { logout } = useContext(AuthContext);

  return (
    <div className="bg-black text-white p-3 flex justify-between">
      <h1>Task Manager</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
