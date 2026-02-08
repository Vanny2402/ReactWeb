import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { FiLoader, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

import paymentApi from "../../api/paymentApi";
import { format2Digit, formatDateAMPM } from "../../utils/formatAmount";
import "./PaymentList.css";

/* ===================== DATE UTILS ===================== */
const toCambodiaDate = (dateStr) =>
  new Date(
    new Date(dateStr).toLocaleString("en-US", {
      timeZone: "Asia/Phnom_Penh",
    })
  );

/* ===================== COMPONENT ===================== */
const PaymentList = () => {
  const now = new Date();

  /* ===================== STATE ===================== */
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  /* Default = current year & month */
  const [filterYear, setFilterYear] = useState(now.getFullYear());
  const [filterMonth, setFilterMonth] = useState(now.getMonth() + 1); // 1–12

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

  /* ===================== FILTER ===================== */
  const filteredPayments = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return payments.filter((p) => {
      const d = p.tzDate;

      /* Year & Month (#) filter */
      if (
        d.getFullYear() !== filterYear ||
        d.getMonth() + 1 !== filterMonth
      ) {
        return false;
      }

      /* Search filter */
      if (!keyword) return true;

      return (
        p.customer?.name?.toLowerCase().includes(keyword) ||
        p.remark?.toLowerCase().includes(keyword) ||
        p.id?.toString().includes(keyword)
      );
    });
  }, [payments, search, filterYear, filterMonth]);

  /* ===================== TOTAL ===================== */
  const totalAmount = useMemo(
    () =>
      filteredPayments.reduce(
        (sum, p) => sum + Number(p.amount || 0),
        0
      ),
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
      {/* LOADING */}
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-80 z-50">
          <FiLoader className="animate-spin mr-2 text-gray-600" size={24} />
          <span className="text-gray-700">កំពុងដំណើរការ...</span>
        </div>
      )}

      {/* FILTER BAR */}
      <div className="flex gap-2">
        {/* SEARCH */}
        <input
          type="text"
          placeholder="ស្វែងរកតាមឈ្មោះ, ចំណាំ ឬ លេខទូទាត់"
          value={search}
          onChange={handleSearch}
          className="search-bar"
        />

        {/* YEAR SELECT */}
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(Number(e.target.value))}
          className="search-bar"
        >
          {Array.from({ length: 5 }, (_, i) => {
            const year = now.getFullYear() - 2 + i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>

        {/* MONTH SELECT (#) */}
        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(Number(e.target.value))}
          className="search-bar"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              ខែ{i + 1}
            </option>
          ))}
        </select>
      </div>

      {/* TOTAL */}
      <div className="monthly-total mt-2">
        <strong>ប្រាក់បានទទួលសរុប: ${totalAmount.toFixed(2)}</strong>
      </div>

      {/* LIST */}
      {filteredPayments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>មិនមានការបង់ប្រាក់ទេ</p>
        </div>
      ) : (
        <div className="card-list mt-1">
          {filteredPayments.map((p) => {
            const isAutoPayment =
              p.remark?.startsWith("បង់ជាមួយការទិញ#");

            return (
              <div key={p.id} className="payment-card mt-1">
                <div className="card-header">
                  <h3 className="customer-name text-blue-500">
                    #{p.id} / {p.customer?.name}
                  </h3>

                  <div className="inline-actions">
                    {/* DELETE */}
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={isAutoPayment}
                      className={`icon-btn delete-icon ${
                        isAutoPayment
                          ? "opacity-40 cursor-not-allowed"
                          : ""
                      }`}
                      title={
                        isAutoPayment
                          ? "មិនអាចលុបបានទេ (Auto Payment)"
                          : "លុប"
                      }
                    >
                      <FiTrash2 size={16} />
                    </button>

                    {/* EDIT */}
                    {isAutoPayment ? (
                      <button
                        disabled
                        className="icon-btn edit-icon opacity-30 cursor-not-allowed"
                        title="មិនអាចកែប្រែបានទេ (Auto Payment)"
                      >
                        <FiEdit size={16} />
                      </button>
                    ) : (
                      <Link
                        to={`/payments/edit/${p.id}`}
                        className="icon-btn edit-icon"
                        title="កែប្រែ"
                      >
                        <FiEdit size={16} />
                      </Link>
                    )}
                  </div>
                </div>

                <p className="flex justify-between">
                  <span className="font-bold">
                    💵 ទឹកប្រាក់បង់: ${format2Digit(p.amount)}
                  </span>
                </p>

                <p>
                  <strong>📅</strong>{" "}
                  {formatDateAMPM(p.paymentDate)} {p.remark}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD BUTTON */}
      <Link to="/payments/add" className="add-fab" title="បន្ថែមការបង់ប្រាក់">
        <FiPlus size={26} />
      </Link>
    </div>
  );
};

export default PaymentList;
