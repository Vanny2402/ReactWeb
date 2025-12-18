import { useEffect, useState, Fragment } from "react";
import purchaseApi from "../../api/purchaseApi";
import { Link } from "react-router-dom";
import { FiLoader } from "react-icons/fi";

const khMonths = [
  "មករា", "កុម្ភះ", "មីនា", "មេសា", "ឧសភា", "មិថុ",
  "កក្ដដា", "សីហា", "កញ្ញា", "តុលា", "វិឆ្ឆិកា", "ធ្នូ",
];

// =======================
// Utils
// =======================

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

const toKhmerDigits = (num) =>
  num.toString().replace(/\d/g, (d) => ["០","១","២","៣","៤","៥","៦","៧","៨","៩"][d]);

const formatKhDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return `${toKhmerDigits(d.getDate())} - ${khMonths[d.getMonth()]}`;
};

// =======================
// Component
// =======================

export default function PurchaseList() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const currentMonthName = khMonths[now.getMonth()];

  useEffect(() => {
    const loadPurchases = async () => {
      try {
        setLoading(true);
        const data = await purchaseApi.getPurchasesByMonthYear({
          month: currentMonth,
          year: currentYear,
        });
        setPurchases(data);
      } catch (err) {
        console.error("Failed to fetch purchases", err);
        setPurchases([]);
      } finally {
        setLoading(false);
      }
    };

    loadPurchases();
  }, [currentMonth, currentYear]);

  const handleDelete = async (id) => {
    if (!window.confirm("តើអ្នកប្រាកដថាចង់លុបការទិញនេះ?")) return;

    try {
      await purchaseApi.deletePurchase(id);
      setPurchases((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("លុបមិនបានជោគជ័យ");
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center py-10 text-gray-600">
          <FiLoader className="animate-spin mr-2" size={28} />
          កំពុងផ្ទុក...
        </div>
    );
  }

  const totalThisMonth = purchases.reduce(
    (sum, p) => sum + (p.totalPrice || 0),
    0
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <table className="table-auto border w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">ផលិតផល</th>
            <th className="border px-2 py-1">ចំនួន</th>
            <th className="border px-2 py-1">តម្លៃ</th>
            <th className="border px-2 py-1">សរុប</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((p) => (
            <Fragment key={p.id}>
              <tr className="bg-yellow-300 font-semibold">
                <td colSpan={4} className="border px-2 py-1">
                  <div className="flex justify-between">
                    <span>លេខសម្គាល់ {p.id}</span>
                    <span>{formatKhDate(p.createdAt)}</span>
                    <span>{p.supplier}</span>
                    <span className="space-x-2">
                      <Link
                        to={`/purchases/edit/${p.id}`}
                        className="text-blue-600"
                      >
                        កែប្រែ
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600"
                      >
                        លុប
                      </button>
                    </span>
                  </div>
                </td>
              </tr>

              {p.items?.length ? (
                p.items.map((item, i) => (
                  <tr key={`${p.id}-${i}`}>
                    <td className="border px-2 py-1">{item.name}</td>
                    <td className="border px-2 py-1">{item.quantity}</td>
                    <td className="border px-2 py-1">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="border px-2 py-1">
                      {formatCurrency(item.lineTotal)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="border px-2 py-1 text-center text-gray-500">
                    មិនមានទំនិញ
                  </td>
                </tr>
              )}

              <tr className="bg-gray-200 font-semibold">
                <td colSpan={3} className="border px-2 py-1 text-red-600">
                  សរុបការទិញលេខ {p.id}
                </td>
                <td className="border px-2 py-1">
                  {formatCurrency(p.totalPrice)}
                </td>
              </tr>
            </Fragment>
          ))}
        </tbody>
      </table>

      <div className="mt-4 text-right font-bold text-lg">
        សរុបការទិញខែនេះ ({currentMonthName}){" "}
        <span className="text-blue-600">
          {formatCurrency(totalThisMonth)}
        </span>
      </div>

      <div className="mt-6">
        <Link
          to="/purchases/add"
          className="block w-full bg-blue-600 text-white text-center py-3 rounded"
        >
          បន្ថែមការទិញ
        </Link>
      </div>
    </div>
  );
}
