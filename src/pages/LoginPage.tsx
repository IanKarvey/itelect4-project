import { useState } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore";

function LoginPage() {
  const [name, setName] = useState<string>("");
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleLogin = (): void => {
    login(name);
    navigate("/submissions");
  };

  return (
    <div className="max-w-sm">
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Login</h2>
      <input value={name} onChange={(e) => setName(e.target.value)}
        placeholder="Your name" className="w-full rounded border border-gray-300 p-2" />
      <button onClick={handleLogin} disabled={name === ""}
        className="mt-3 rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400">
        Log In
      </button>
    </div>
  );
}

export default LoginPage;
