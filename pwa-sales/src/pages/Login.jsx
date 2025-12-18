import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validUserHash =
    "703fd2a32f3b8ff197cb703f5d7718804ecfd3aa18afc37fcc572c6eb981b6c4";
  const validPassHash =
    "703fd2a32f3b8ff197cb703f5d7718804ecfd3aa18afc37fcc572c6eb981b6c4";

  async function hashValue(value) {
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    const userHash = await hashValue(username);
    const passHash = await hashValue(password);

    if (userHash === validUserHash && passHash === validPassHash) {
      setError("");
      navigate("/customers"); // ✅ redirect
    } else {
      setError("លេខកូដសម្ងាត់មិនត្រឹមត្រូវ!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg">
            ចូលប្រើ
          </button>
        </form>
      </div>
    </div>
  );
}
