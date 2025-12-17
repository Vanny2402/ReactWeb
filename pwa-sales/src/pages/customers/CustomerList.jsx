import { useEffect, useState, useMemo } from "react";
import { FiPlus, FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  getAllCustomers,
  getCustomerById,
} from "../../api/customerApi";

export default function CustomerList() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const res = await getAllCustomers();
        setCustomers(res);
      } catch (err) {
        alert("មិនអាចទាញបញ្ជីអតិថិជនបានទេ!");
      } finally {
        setLoading(false);
      }
    };
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(
    () =>
      customers.filter((c) =>
        c.name?.toLowerCase().includes(search.toLowerCase())
      ),
    [customers, search]
  );

  const sumDebt = useMemo(
    () =>
      customers.reduce((sum, c) => sum + Number(c.totalDebt ?? 0), 0),
    [customers]
  );

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  // ✅ CALL CUSTOMER DETAILS ON CLICK
  const handleClick = async (id) => {
    try {
      setLoading(true);
      const customer = await getCustomerById(id);
      navigate(`/customers/${id}`, { state: customer });
    } catch (err) {
      alert("មិនអាចទាញព័ត៌មានអតិថិជនបានទេ!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 mb-16">

      <input
        className="w-full border rounded-xl px-4 py-2 mb-4"
        placeholder="ស្វែងរក..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {/* Balance Card */}
      <div className="px-4 mb-4">
        <div className="rounded-2xl p-3 text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow">
          <p className="text-1xl font-bold ">ប្រាក់ត្រូវទទួលសរុប: {formatCurrency(sumDebt)}</p>
        </div>
      </div>
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-10 text-gray-500">
            <FiLoader className="animate-spin mr-2" />
            កំពុងផ្ទុក...
          </div>
        ) : (
          filteredCustomers.map((c) => (
            <div
              key={c.id}
              onClick={() => handleClick(c.id)}
              className="flex justify-between items-center bg-white p-4 rounded-xl shadow cursor-pointer hover:shadow-md"
            >
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-gray-500">{c.phone}</p>
                <p className="text-sm text-gray-400">{c.address}</p>
              </div>
              <p
                className={`font-bold ${c.totalDebt > 0 ? "text-red-600" : "text-green-600"
                  }`}
              >
                {formatCurrency(c.totalDebt ?? 0)}
              </p>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => navigate("add")}
        className="fixed bottom-20 right-5 bg-blue-600 text-white p-4 rounded-full"
      >
        <FiPlus size={24} />
      </button>
    </div>
  );
}
