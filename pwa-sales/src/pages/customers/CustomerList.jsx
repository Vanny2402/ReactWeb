import { useEffect, useState } from "react";
import { FiPlus, FiLoader } from "react-icons/fi";
import { Link } from "react-router-dom";
import { getAllCustomers } from "../../api/customerApi.js";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      setLoading(true);
      const res = await getAllCustomers();
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
      alert("មិនអាចទាញបញ្ជីអតិថិជនបានទេ!");
    } finally {
      setLoading(false);
    }
  }

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 mb-16">
      <input
        type="text"
        placeholder="ស្វែងរក..."
        className="w-full border rounded-xl px-4 py-2 mb-4 shadow-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center items-center py-10 text-gray-500">
            <FiLoader className="animate-spin mr-2" size={20} />
            កំពុងផ្ទុក...
          </div>
        ) : (
          filteredCustomers.map((c) => (
            <Link
              key={c.id}
              to={`/customers/${c.id}`}
              className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-gray-500">{c.phone}</p>
                <p className="text-sm text-gray-400">{c.address}</p>
              </div>
              <p
                className={`font-bold ${
                  c.debt > 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                ${c.debt ?? 0}
              </p>
            </Link>
          ))
        )}
      </div>

      <Link
        to="/customers/add"
        className="fixed bottom-20 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <FiPlus size={24} />
      </Link>
    </div>
  );
}
