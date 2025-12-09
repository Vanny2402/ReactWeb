import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);   // 👈 state for data
  const [loading, setLoading] = useState(true);     // 👈 state for loading
  const [error, setError] = useState(null);         // 👈 state for error

  useEffect(() => {
    async function fetchCustomers() {
      try {
        setLoading(true);
        const res = await fetch("https://myinvoice-f70e.onrender.com/api/customers");
        if (!res.ok) {
          throw new Error("Failed to fetch customers");
        }
        const data = await res.json();
        setCustomers(data); // 👈 backend should return array of customers
      } catch (err) {
        console.error(err);
        setError("មិនអាចទាញយកអតិថិជនបានទេ!");
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  return (
    <div className="p-4 mb-16">
      <h1 className="text-xl font-bold mb-4">អតិថិជន</h1>

      <input
        type="text"
        placeholder="ស្វែងរក..."
        className="w-full border rounded-xl px-4 py-2 mb-4 shadow-sm"
      />

      {loading && <p>កំពុងទាញយក...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-3">
        {customers.map((c) => (
          <Link
            key={c.id}
            to={`/customers/${c.id}`}
            className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm"
          >
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-gray-500">{c.phone}</p>
            </div>
            <p
              className={`font-bold ${
                c.debt > 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              ${c.debt}
            </p>
          </Link>
        ))}
      </div>

      <Link
        to="/customers/add"
        className="fixed bottom-20 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg"
      >
        <FiPlus size={24} />
      </Link>
    </div>
  );
}