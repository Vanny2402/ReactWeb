import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import paymentApi from "../../api/paymentApi";
import { FiLoader, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import "./PaymentList.css";

/* Convert backend date → Cambodia timezone */
const toCambodiaDate = (dateStr) =>
  new Date(
    new Date(dateStr).toLocaleString("en-US", {
      timeZone: "Asia/Phnom_Penh",
    })
  );

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===================== LOAD DATA ===================== */
  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        const res = await paymentApi.getAllPaymentForReport();

        const normalized = (res.data || [])
          .map((p) => ({
            ...p,
            tzDate: toCambodiaDate(p.paymentDate),
          }))
          .sort((a, b) => b.tzDate - a.tzDate);

        setPayments(normalized);
      } catch (err) {
        console.error(err);
        alert("❌ មិនអាចទាញយកការបង់ប្រាក់បានទេ!");
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  /* ===================== SEARCH FILTER ===================== */
  const filteredPayments = useMemo(() => {
    if (!search.trim()) return payments;

    const value = search.toLowerCase();

    return payments.filter(
      (p) =>
        p.customer?.name?.toLowerCase().includes(value) ||
        p.remark?.toLowerCase().includes(value) ||
        p.id?.toString().includes(value)
    );
  }, [payments, search]);

  /* ===================== TOTAL ===================== */
  const totalAmount = useMemo(
    () =>
      filteredPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0),
    [filteredPayments]
  );

  /* ===================== ACTIONS ===================== */
  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("តើអ្នកពិតជាចង់លុបការបង់ប្រាក់នេះមែនទេ?")) return;

    try {
      setLoading(true);
      await paymentApi.removePayment(id);
      setPayments((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("❌ មិនអាចលុបការបង់ប្រាក់បានទេ!");
    } finally {
      setLoading(false);
    }
  }, []);

  /* ===================== UI ===================== */
  return (
    <div className="payment-list">
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-80 z-50">
          <FiLoader className="animate-spin mr-2 text-gray-600" size={24} />
          <span className="text-gray-700">កំពុងដំណើរការ...</span>
        </div>
      )}

      {/* SEARCH */}
      <input
        type="text"
        placeholder="ស្វែងរកតាមឈ្មោះ, ចំណាំ ឬ លេខទូទាត់"
        value={search}
        onChange={handleSearch}
        className="search-bar"
      />

      {/* TOTAL */}
      <div className="monthly-total">
        <strong>ប្រាក់បានទទួលសរុប: ${totalAmount.toFixed(2)}</strong>
      </div>

      {/* LIST */}
      {filteredPayments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>មិនមានការបង់ប្រាក់ទេ</p>
        </div>
      ) : (
        <div className="card-list">
          {filteredPayments.map((p) => (
            <div key={p.id} className="payment-card">
              <div className="card-header">
                <h3 className="customer-name text-blue-500">
                  #{p.id} / {p.customer?.name} 
                </h3>

                <div className="inline-actions">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="icon-btn delete-icon"
                  >
                    <FiTrash2 size={16} />
                  </button>

                  <Link
                    to={`/payments/edit/${p.id}`}
                    className="icon-btn edit-icon"
                  >
                    <FiEdit size={16} />
                  </Link>
                </div>
              </div>

              <p className="flex justify-between">
                {/* <span className="font-semibold">{p.remark}</span> */}
                <span className="font-bold mr-3">💵 ${p.amount}</span> 
              </p>

              <p>
                <strong>📅</strong>{" "}
                {p.tzDate.toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}      {p.remark}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* FLOATING ADD ICON */}
      <Link
        to="/payments/add"
        className="add-fab"
        title="បន្ថែមការបង់ប្រាក់"
      >
        <FiPlus size={26} />
      </Link>
    </div>
  );
};

export default PaymentList;
