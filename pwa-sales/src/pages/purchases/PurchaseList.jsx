import { useEffect, useState } from "react";
import { getPurchasesByMonthYear, deletePurchase } from "../../api/purchaseApi.js";
import { Link } from "react-router-dom";
import { FiLoader } from "react-icons/fi";

const khMonths = [
  "មករា", "កុម្ភះ", "មីនា", "មេសា", "ឧសភា", "មិថុ",
  "កក្ដដា", "សីហា", "កញ្ញា", "តុលា", "វិឆ្ឆិកា", "ធ្នូ"
];

// Currency formatter
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

// Convert digits to Khmer numerals
const toKhmerDigits = (num) =>
  num.toString().replace(/\d/g, (d) => ["០","១","២","៣","៤","៥","៦","៧","៨","៩"][d]);

// Format date in Khmer style
const formatKhDate = (dateStr) => {
  const d = new Date(dateStr);
  return `${toKhmerDigits(d.getDate())} - ${khMonths[d.getMonth()]}`;
};

export default function PurchaseList() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  // Current month/year
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // backend expects 1–12
  const currentYear = now.getFullYear();
  const currentMonthName = khMonths[now.getMonth()];

  useEffect(() => {
    getPurchasesByMonthYear({ month: currentMonth, year: currentYear })
      .then((list) => setPurchases(list))
      .catch((err) => {
        console.error("Failed to fetch purchases", err);
        setPurchases([]);
      })
      .finally(() => setLoading(false));
  }, [currentMonth, currentYear]);

  const handleDelete = async (id) => {
    if (window.confirm("តើអ្នកប្រាកដថាចង់លុបការទិញនេះ?")) {
      await deletePurchase(id);
      setPurchases((prev) => prev.filter((p) => p.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10 text-gray-600">
        <FiLoader className="animate-spin mr-2" size={22} />
        កំពុងផ្ទុក...
      </div>
    );
  }

  // Monthly total
  const totalThisMonth = purchases.reduce(
    (sum, p) => sum + (p.totalPrice || 0),
    0
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <table className="table-auto border w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1 text-left">ផលិតផល</th>
            <th className="border px-2 py-1 text-left">ចំនួន</th>
            <th className="border px-2 py-1 text-left">តម្លៃ</th>
            <th className="border px-2 py-1 text-left">សរុប</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((p) => (
            <>
              {/* Group header row */}
              <tr key={`purchase-${p.id}`} className="bg-yellow-300 font-semibold">
                <td colSpan={4} className="border px-2 py-1 text-left">
                  <div className="flex justify-between">
                    <span>លេខសម្គាល់ {p.id}</span>
                    <span>{formatKhDate(p.createdAt)}</span>
                    <span>{p.supplier}</span>
                    <span className="space-x-2">
                      <Link
                        to={`/purchases/edit/${p.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        កែប្រែ
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600 hover:underline"
                      >
                        លុប
                      </button>
                    </span>
                  </div>
                </td>
              </tr>

              {/* Item rows */}
              {Array.isArray(p.items) && p.items.length > 0 ? (
                p.items.map((item, idx) => (
                  <tr key={`item-${p.id}-${idx}`}>
                    <td className="border px-2 py-1 text-left">{item.name}</td>
                    <td className="border px-2 py-1 text-left">{item.quantity}</td>
                    <td className="border px-2 py-1 text-left">{formatCurrency(item.price)}</td>
                    <td className="border px-2 py-1 text-left">{formatCurrency(item.lineTotal)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="border px-2 py-1 text-center text-gray-500">
                    មិនមានទំនិញ
                  </td>
                </tr>
              )}

              {/* Subtotal row */}
              <tr className="bg-gray-200 font-semibold">
                <td colSpan={3} className="border px-2 py-1 text-left text-red-600">
                  សរុបការទិញលេខ {p.id} គឺ:
                </td>
                <td className="border px-2 py-1 text-left">
                  {formatCurrency(p.totalPrice)}
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>

      {/* Total this month */}
      <div className="mt-4 text-right font-bold text-lg">
        សរុបការទិញខែនេះ ({currentMonthName}){" "}
        <span className="text-blue-600">{formatCurrency(totalThisMonth)}</span>
      </div>

      {/* Add Purchase button */}
      <div className="mt-6">
        <Link
          to="/purchases/add"
          className="block w-full bg-blue-600 text-white text-center py-3 rounded hover:bg-blue-700"
        >
          បន្ថែមការទិញ
        </Link>
      </div>
    </div>
  );
}
