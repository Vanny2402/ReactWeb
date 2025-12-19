import { useState, useEffect, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FiLoader } from "react-icons/fi";
import customerApi from "../../api/customerApi";
// import paymentApi from "../../api/paymentApi";
// import saleApi from "../../api/saleApi";

export default function CustomerDetails() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  // ---------------- STATE ----------------
  const [customer, setCustomer] = useState(state || null);
  const [payments, setPayments] = useState([]);
  const [sales, setSales] = useState([]);
  const [activeTab, setActiveTab] = useState("payment");
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);

        const [custRes, payRes, saleRes] = await Promise.all([
          customer ? null : customerApi.getCustomerById(id),
          customerApi.getPaymentsByCustomerId(id),
          customerApi.getSalesByCustomerId(id)
        ]);

        if (!mounted) return;

        if (custRes) setCustomer(custRes);
        setPayments(payRes || []);
        setSales(saleRes || []);
      } catch (err) {
        console.error("មានបញ្ហាក្នុងការទាញអតិថិជន:", err);
      } finally {
        mounted && setLoading(false);
      }
    };


    if (id) loadData();
    return () => (mounted = false);
  }, [id]);

  // ---------------- DERIVED DATA ----------------
  const customerPayments = useMemo(() => {
    return payments
      .filter((p) => p.customer?.id === customer?.id)
      .sort(
        (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
      );
  }, [payments, customer]);

  const customerSales = useMemo(() => {
    return sales
      .filter((s) => s.customer?.id === customer?.id)
      .sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
  }, [sales, customer]);

  const totalPayments = useMemo(() => {
    return customerPayments.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );
  }, [customerPayments]);

  const totalSales = useMemo(() => {
    return customerSales.reduce(
      (sum, s) => sum + Number(s.totalPrice || 0),
      0
    );
  }, [customerSales]);

  // ---------------- UTILS ----------------
  const formatAmount = (val) => Number(val || 0).toFixed(2);

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 space-y-6">

          {/* HEADER */}
          <div className="bg-indigo-700 rounded-xl p-3 flex items-center text-white">
            <div className="flex-1">
              <p className="font-semibold">{customer?.name}</p>
              <p className="text-xs mt-1">
                លេខទូរស័ព្ទ : {customer?.phone}
              </p>
            </div>
            <p className="font-semibold">
              ត្រូវបង់ ${formatAmount(customer?.totalDebt)}
            </p>
          </div>

          {/* TABS */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { id: "payment", label: "ការបង់ប្រាក់" },
              { id: "sale", label: "ការលក់" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition ${activeTab === t.id
                  ? "bg-white text-indigo-600 shadow"
                  : "text-gray-500"
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* PAYMENT TAB */}
          {activeTab === "payment" && (
            <div>
              <h2 className="font-semibold">ប្រតិបត្តិការបង់ប្រាក់</h2>

              {loading ? (
                <div className="flex flex-col items-center py-10 text-gray-500">
                  <FiLoader className="animate-spin" size={20} />
                  <p>កំពុងផ្ទុក...</p>
                </div>
              ) : (
                <>
                  <ul className="text-sm space-y-2 mt-2">
                    {customerPayments.map((p) => {
                      const date = new Date(p.paymentDate)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        })
                        .replace(/\//g, "-");

                      return (
                        <li key={p.id} className="flex justify-between">
                          <span>
                            {date} (#{p.id})
                            <span className="text-red-400 text-xs ml-1">
                              {p.remark}
                            </span>
                          </span>
                          <span>${formatAmount(p.amount)}</span>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="flex justify-between font-semibold mt-3 border-t pt-2">
                    <span>ប្រាក់បង់កន្លងមក</span>
                    <span className="bg-sky-400 px-2 rounded">
                      ${formatAmount(totalPayments)}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* SALE TAB */}
          {activeTab === "sale" && (
            <div>
              <h2 className="font-semibold">ប្រតិបត្តិការលក់</h2>

              {loading ? (
                <div className="flex flex-col items-center py-10 text-gray-500">
                  <FiLoader className="animate-spin" size={20} />
                  <p>កំពុងផ្ទុក...</p>
                </div>
              ) : (
                <>
                  <ul className="text-sm space-y-2 mt-2">
                    {customerSales.map((s) => {
                      const date = new Date(s.createdAt)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        })
                        .replace(/\//g, "-");

                      return (
                        <li key={s.id} className="flex justify-between">
                          <span>
                            {date} (#{s.id})
                          </span>
                          <span>${formatAmount(s.totalPrice)}</span>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="flex justify-between font-semibold mt-3 border-t pt-2">
                    <span>ការលក់កន្លងមក</span>
                    <span className="bg-green-300 px-2 rounded">
                      ${formatAmount(totalSales)}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* CTA */}
          {/* <button
            onClick={() =>
              activeTab === "payment"
                ? navigate(`/payments/add/${customer?.id}`)
                : navigate(`/sales/ProductSale?customerId=${customer?.id}`)
            }
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold mt-4"
          >
            {activeTab === "payment" ? "បង់ប្រាក់បន្ថែម" : "លក់បន្ថែម"}
          </button> */}

          <button
            onClick={() =>
              activeTab === "payment"
                ? navigate(`/payments/add/${customer?.id}`, {
                  state: {
                    amount: customer?.totalDebt, // 👈 pass debt
                  },
                })
                : navigate(`/sales/ProductSale?customerId=${customer?.id}`)
            }
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold mt-4"
          >
            {activeTab === "payment" ? "បង់ប្រាក់បន្ថែម" : "លក់បន្ថែម"}
          </button>


        </div>
      </div>
    </div>
  );
}