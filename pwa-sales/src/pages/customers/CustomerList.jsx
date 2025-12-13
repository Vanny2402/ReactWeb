import { useEffect, useState, useMemo } from "react";
import { FiPlus, FiLoader } from "react-icons/fi";
import { Link } from "react-router-dom";
import { getAllCustomers } from "../../api/customerApi.js";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Load customers once on mount
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        const res = await getAllCustomers();
        // API returns array of customers
        setCustomers(res);
      } catch (err) {
        console.error(err);
        alert("មិនអាចទាញបញ្ជីអតិថិជនបានទេ!");
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  // ✅ Derived state: filter + sum
  const filteredCustomers = useMemo(
    () =>
      customers.filter((c) =>
        c.name?.toLowerCase().includes(search.toLowerCase())
      ),
    [customers, search]
  );

  const sumDebt = useMemo(
    () =>
      customers.reduce(
        (sum, c) => sum + Number(c.totalDebt ?? 0),
        0
      ),
    [customers]
  );

  // ✅ Helper to format currency
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  return (
    <div className="p-4 mb-16">
      {/* Search box */}
      <input
        type="text"
        placeholder="ស្វែងរក..."
        className="w-full border rounded-xl px-4 py-2 mb-4 shadow-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Total debt */}
      <div className="mb-4 text-right font-bold text-purple-600">
        បំណុលសរុបគ្រប់អតិថិជន: {formatCurrency(sumDebt)}
      </div>

      {/* Customer list */}
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
                  Number(c.totalDebt) > 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                {formatCurrency(c.totalDebt ?? 0)}
              </p>
            </Link>
          ))
        )}
      </div>

      {/* Add customer button */}
      <Link
        to="/customers/add"
        className="fixed bottom-20 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <FiPlus size={24} />
      </Link>
    </div>
  );
}
