import { useState, useEffect } from "react";
import { FiPlus, FiEdit } from "react-icons/fi";
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

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="p-4 mb-16">
      {/* ✅ Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="ស្វែងរកតាមឈ្មោះអតិថិជន..."
          className="w-full md:w-1/2 border px-4 py-2 rounded-xl shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ✅ Loading & Error States */}
      {loading ? <p className="text-gray-600 text-center">កំពុងផ្ទុក...</p>: error ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCustomers.map((c) => (
            <CustomerCard key={c.id} customer={c} />
          ))}

          {/* ✅ Empty State */}
          {filteredCustomers.length === 0 && (
            <p className="text-center text-gray-500">រកមិនឃើញអតិថិជន</p>
          )}
        </div>
      )}

      {/* ✅ Floating Add Button */}
      <Link
        to="/customers/add"
        className="fixed bottom-20 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <FiPlus size={24} />
      </Link>
    </div>
  );
}

/* 🔹 Extracted CustomerCard for clarity */
function CustomerCard({ customer }) {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
      {/* ✅ Customer Detail Link */}
      <Link to={`/customers/${customer.id}`} className="flex-1">
        <p className="font-semibold">{customer.name}</p>
        <p className="text-sm text-gray-500">{customer.phone}</p>
      </Link>

      {/* ✅ Debt Display */}
      <p
        className={`font-bold mr-4 ${
          customer.debt > 0 ? "text-red-600" : "text-green-600"
        }`}
      >
        ${customer.debt}
      </p>

      {/* ✅ Edit Button */}
      <Link
        to={`/customers/edit/${customer.id}`}
        className="text-blue-600 hover:text-blue-800"
      >
        <FiEdit size={22} />
      </Link>
    </div>
  );
}
