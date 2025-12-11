import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchCustomers() {
      try {
        setLoading(true);
        const res = await fetch("https://myinvoice-f70e.onrender.com/api/customers");
        if (!res.ok) throw new Error("Failed to fetch customers");

        const data = await res.json();
        setCustomers(data);
      } catch (err) {
        console.error(err);
        setError("មិនអាចទាញយកអតិថិជនបានទេ!");
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  // ✅ Filter customers by name or phone
  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="p-4 mb-16">

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="ស្វែងរកតាមឈ្មោះអតិថិជន..."
          className="w-full md:w-1/2 border px-4 py-2 rounded-xl shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p>កំពុងទាញយក...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-3">
        {filteredCustomers.map((c) => (
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

        {/* ✅ Show message when no results */}
        {!loading && filteredCustomers.length === 0 && (
          <p className="text-center text-gray-500">រកមិនឃើញអតិថិជន</p>
        )}
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
