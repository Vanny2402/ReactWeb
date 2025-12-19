import { useEffect, useState, useMemo } from "react";
import { FiPlus, FiLoader, FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getAllCustomers } from "../../api/customerApi";

export default function CustomerList() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadCustomers = async () => {
      try {
        const res = await getAllCustomers();
        if (mounted) setCustomers(res || []);
      } catch {
        alert("មិនអាចទាញបញ្ជីអតិថិជនបានទេ!");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadCustomers();
    return () => (mounted = false);
  }, []);

  const filteredCustomers = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter(c =>
      c.name?.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const sumDebt = useMemo(
    () => customers.reduce((s, c) => s + Number(c.totalDebt || 0), 0),
    [customers]
  );

  const formatCurrency = (v) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(v || 0);

  return (
    <div className="p-4 mb-16">
      <input
        className="w-full border rounded-xl px-4 py-2 mb-4"
        placeholder="ស្វែងរក..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="mb-4">
        <div className="rounded-2xl p-3 text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow">
          <p className="font-bold">
            ប្រាក់ត្រូវទទួលសរុប: {formatCurrency(sumDebt)}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10 text-gray-600">
          <FiLoader className="animate-spin mr-2" size={26} />
          កំពុងផ្ទុក...
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCustomers.map((c) => (
            <div
              key={c.id}
              onClick={() =>
                navigate(`/customers/${c.id}`, { state: c })
              }
              className="flex justify-between items-center bg-white p-4 rounded-xl shadow hover:shadow-md cursor-pointer"
            >
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-gray-500">{c.phone}</p>
                <p className="text-sm text-gray-400">{c.address}</p>
              </div>

              <div className="flex items-center gap-3">
                <p
                  className={`font-bold ${
                    c.totalDebt > 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {formatCurrency(c.totalDebt)}
                </p>

                <FiEdit
                  size={20}
                  className="text-blue-600 hover:text-blue-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/customers/edit/${c.id}`);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate("/customers/add")}
        className="fixed bottom-20 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg"
      >
        <FiPlus size={24} />
      </button>
    </div>
  );
}
