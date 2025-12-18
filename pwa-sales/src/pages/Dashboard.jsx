import { useState } from "react";
import CustomerList from "../pages/customers/CustomerList";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const userHash = await hashValue(username);
    const passHash = await hashValue(password);

    if (userHash === validUserHash && passHash === validPassHash) {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("លេខកូដសម្ងាត់មិនត្រឹមត្រូវ!");
    }
  };

  if (isLoggedIn) {
    return <CustomerList />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome Back ssssssssssssssss👋
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            ចូលប្រើ
          </button>
        </form>
      </div>
    </div>
  );
}