import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import paymentApi from "../../api/paymentApi";
import { FiLoader, FiEdit, FiTrash2 } from "react-icons/fi";
import "./PaymentList.css";

const toCambodiaDate = (dateStr) =>
  new Date(new Date(dateStr).toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" }));

const isThisMonth = (date) => {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" }));
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true); // used for both initial load + delete

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        const res = await paymentApi.getAllPayments();
        let all = (res.data || []).map((p) => ({
          ...p,
          tzDate: toCambodiaDate(p.paymentDate),
        }));
        all.sort((a, b) => b.tzDate - a.tzDate);
        setPayments(all);
      } catch (err) {
        console.error(err);
        alert("❌ មិនអាចទាញយកការបង់ប្រាក់បានទេ!");
      } finally {
        setLoading(false);
      }
    };
    loadPayments();
  }, []);

  const filtered = useMemo(() => {
    const value = search.toLowerCase();
    return payments.filter(
      (p) =>
        isThisMonth(p.tzDate) &&
        ((p.customer?.name && p.customer.name.toLowerCase().includes(value)) ||
          (p.remark && p.remark.toLowerCase().includes(value))) ||
        (p.id && p.id.toString().includes(value))
    );
  }, [payments, search]);

  const monthlyTotal = useMemo(
    () => filtered.reduce((sum, p) => sum + Number(p.amount), 0),
    [filtered]
  );

  const handleSearch = useCallback((e) => setSearch(e.target.value), []);

  const handleDelete = useCallback(
    async (id) => {
      if (window.confirm("តើអ្នកពិតជាចង់លុបការបង់ប្រាក់នេះមែនទេ?")) {
        try {
          setLoading(true); // lock whole screen
          await paymentApi.removePayment(id);
          setPayments((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
          console.error(err);
          alert("❌ មិនអាចលុបការបង់ប្រាក់បានទេ!");
        } finally {
          setLoading(false); // unlock screen
        }
      }
    },
    []
  );

  return (
    <div className="payment-list">
      {loading ? (
        // Full-screen overlay
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-80 z-50">
          <FiLoader className="animate-spin mr-2 text-gray-600" size={24} />
          <span className="text-gray-700">កំពុងដំណើរការ...</span>
        </div>
      ) : (
        <>
          <input
            type="text"
            placeholder="ស្វែងរកតាឈ្មោះ,ចំណាំ​ ឬ លេខទូទាត់ "
            value={search}
            onChange={handleSearch}
            className="search-bar"
          />

          <div className="monthly-total">
            <strong>ប្រាក់បានទទួលសរុបក្នុងខែនេះ {monthlyTotal.toFixed(2)}$</strong>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>មិនមានការបង់ប្រាក់ក្នុងខែនេះទេ</p>
            </div>
          ) : (
            <div className="card-list">
              {filtered.map((p) => (
                <div key={p.id} className="payment-card">
                  <div className="card-header">
                    <h3 className="customer-name">{p.customer?.name}</h3>
                    <div className="inline-actions">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="icon-btn delete-icon"
                      >
                        <FiTrash2 size={16} />
                      </button>
                      <Link to={`/payments/edit/${p.id}`} className="icon-btn edit-icon">
                        <FiEdit size={16} />
                      </Link>
                    </div>
                  </div>
                  <p className="flex justify-between">
                    <span className="font-semibold">#{p.id} {p.remark}</span>
                    <span className="font-bold mr-3">💵 ${p.amount}</span>
                  </p>


                  {/* <p>
                    <strong>💵ទឹកប្រាក់បង់:</strong> ${p.amount}
                  </p> */}
                  <p>
                    <strong>📅</strong> {p.tzDate.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          <Link to="/payments/add" className="btn btn-add">
            បន្ថែមការបង់ប្រាក់
          </Link>
        </>
      )}
    </div>
  );
};

export default PaymentList;
