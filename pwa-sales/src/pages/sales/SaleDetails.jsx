import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import saleApi from "../../api/saleApi";
import { FiLoader } from "react-icons/fi";
import { formatUsdKhrLine, USD_TO_KHR_RATE } from "../../utils/formatAmount";

export default function SaleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const res = await saleApi.getSaleById(id);
        setSale(res.data || res);
      } catch (err) {
        console.error("Error fetching sale:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSale();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <FiLoader className="animate-spin mr-2" size={30} />
        កំពុងផ្ទុក...
      </div>
    );
  }

  if (!sale) return <p className="text-center text-red-500">Sale not found</p>;

  const total = Number(sale.totalPrice ?? 0);
  const paid = Number(sale.paidAmount ?? 0);
  const debt = Number(sale.debt ?? 0);

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold text-blue-600">
        លេខការលក់ #{sale.id} - {sale.customer?.name}
      </h2>
      <p className="text-sm text-gray-500 font-bold">
        {new Date(sale.createdAt).toLocaleString()}
      </p>
      <h3 className="font-semibold">បញ្ជីផលិតផល</h3>
      <ul className="space-y-2">
        {sale.items?.map((item, idx) => (
          <li key={idx} className="flex justify-between border-b pb-1">
            <span className="ml-2">{item.product?.name}</span>
            <span className="mr-5">
              {item.qty} × ${Number(item.price ?? 0).toFixed(2)} = $
              {Number(item.lineTotal ?? 0).toFixed(2)}
            </span>
          </li>
        ))}

        <div className="border rounded p-3 bg-gray-50 space-y-2 text-sm">
          <p>
            <span className="font-semibold">ចំនួនទឹកប្រាក់សរុប :</span>{" "}
            {formatUsdKhrLine(total)}
          </p>
          <p>
            <span className="font-semibold">បានបង់:</span>{" "}
            {formatUsdKhrLine(paid)}
          </p>
          <p>
            <span className="font-semibold">ជំពាក់:</span>{" "}
            {formatUsdKhrLine(debt)}
          </p>
          <p className="text-xs text-gray-600 pt-1 border-t border-gray-200">
            FX = {USD_TO_KHR_RATE} (1$ = {USD_TO_KHR_RATE.toLocaleString()} ៛)
          </p>
        </div>
      </ul>

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="bg-gray-200 px-4 py-2 rounded"
      >
        ថយក្រោយ
      </button>
    </div>
  );
}
