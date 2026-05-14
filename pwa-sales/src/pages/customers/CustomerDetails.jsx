import { useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FiLoader } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import customerApi from "../../api/customerApi";
import { formatUsdKhrLine } from "../../utils/formatAmount";

export default function CustomerDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const navState = location.state;
  const customerFromNav =
    navState?.customer != null && typeof navState.customer === "object"
      ? navState.customer
      : navState?.id != null
        ? navState
        : undefined;
  const listRestore =
    navState?.customer != null && typeof navState.customer === "object"
      ? navState.listRestore
      : undefined;

  const [activeTab, setActiveTab] = useState("payment");

  /* ================= QUERIES ================= */
  const customerQuery = useQuery({
    queryKey: ["customer", id],
    queryFn: () => customerApi.getCustomerById(id),
    enabled: !!id,
    placeholderData: customerFromNav,
    staleTime: 60_000,
  });

  const paymentsQuery = useQuery({
    queryKey: ["customer-payments", id],
    queryFn: () => customerApi.getPaymentsByCustomerId(id),
    enabled: !!id,
    staleTime: 60_000,
  });

  const salesQuery = useQuery({
    queryKey: ["customer-sales", id],
    queryFn: () => customerApi.getSalesByCustomerId(id),
    enabled: !!id,
    staleTime: 60_000,
  });

  const customer = customerQuery.data;

  const loading =
    customerQuery.isPending ||
    paymentsQuery.isPending ||
    salesQuery.isPending;

  /* ================= MEMO DATA ================= */
  const customerPayments = useMemo(() => {
    return [...(paymentsQuery.data || [])].sort(
      (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
    );
  }, [paymentsQuery.data]);

  const customerSales = useMemo(() => {
    return [...(salesQuery.data || [])].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [salesQuery.data]);

  const formatAmount = (val) => Number(val || 0).toFixed(2);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center pb-6 pt-0">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm overflow-x-hidden">

        <div className="p-4 space-y-5">

          {/* ================= BACK BUTTON (FIXED NAV FLOW) ================= */}
          <button
            type="button"
            onClick={() =>
              listRestore
                ? navigate("/customers", { state: { listRestore } })
                : navigate(-1)
            }
            className="text-sm font-semibold flex items-center gap-1 rounded-lg bg-indigo-600 text-white px-3 py-2 shadow-sm hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
          >
            ← ត្រឡប់ក្រោយ
          </button>

          {/* ================= HEADER (sticky: name / phone / debt row) ================= */}
          <div className="sticky top-0 z-20 -mx-4 px-4 pt-0 bg-gray-50 pb-1">
            <div className="bg-indigo-700 rounded-xl flex items-center text-white shadow-sm">
              <div className="flex-1 flex flex-col gap-0.5 px-2 py-2 min-w-0">
                <p className="font-semibold truncate">{customer?.name}</p>
                <p className="text-xs font-semibold truncate">
                  លេខទូរស័ព្ទ : {customer?.phone}
                </p>
              </div>

              <div className="pr-3 text-right text-sm shrink-0">
                <p className="bg-orange-100 text-orange-600 px-2 py-1 rounded-lg inline-block">
                  ត្រូវបង់ {formatUsdKhrLine(customer?.totalDebt)}
                </p>
              </div>
            </div>
          </div>

          {/* ================= TABS ================= */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { id: "payment", label: "ការបង់ប្រាក់" },
              { id: "sale", label: "ការលក់" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 py-2 text-sm font-medium rounded-md ${
                  activeTab === t.id
                    ? "bg-white text-indigo-600 shadow"
                    : "text-gray-500"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ================= LOADING ================= */}
          {loading && (
            <div className="flex flex-col items-center py-10 text-gray-500">
              <FiLoader className="animate-spin" size={20} />
              <p>កំពុងផ្ទុក...</p>
            </div>
          )}

          {/* ================= PAYMENT ================= */}
          {!loading && activeTab === "payment" && (
            <ul className="text-sm space-y-2">
              {customerPayments.map((p) => (
                <li key={p.id} className="flex justify-between">
                  <span>
                    {new Date(p.paymentDate)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "-")}
                    {" "}#{p.id}
                    <span className="text-red-400 text-xs ml-1">
                      {p.remark}
                    </span>
                  </span>
                  <span>${formatAmount(p.amount)}</span>
                </li>
              ))}
            </ul>
          )}

          {/* ================= SALE ================= */}
          {!loading && activeTab === "sale" && (
            <ul className="text-sm space-y-1">
              {customerSales.map((s) => (
                <li key={s.id} className="flex justify-between">
                  <span>
                    {new Date(s.createdAt)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, ".")}
                    {" "}#{s.id}
                    <span className="text-red-400 text-xs ml-1">
                      {s.items?.length
                        ? s.items.map((i) => i.productName).join("|")
                        : s.remark}
                    </span>
                  </span>
                  <span>${formatAmount(s.totalPrice)}</span>
                </li>
              ))}
            </ul>
          )}

          {/* ================= ACTION ================= */}
          <button
            onClick={() =>
              navigate(
                activeTab === "payment"
                  ? `/payments/add/${customer?.id}`
                  : `/sales/ProductSale?customerId=${customer?.id}`
              )
            }
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold"
          >
            {activeTab === "payment"
              ? "បង់ប្រាក់បន្ថែម"
              : "លក់បន្ថែម"}
          </button>

        </div>
      </div>
    </div>
  );
}