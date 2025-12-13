import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import paymentApi from "../../api/paymentApi";
import { FiLoader } from "react-icons/fi";
import "./PaymentList.css";

// Helper: convert to Cambodia timezone once
const toCambodiaDate = (dateStr) =>
  new Date(new Date(dateStr).toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" }));

const isThisMonth = (date) => {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" }));
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Load payments once
  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        const res = await paymentApi.getAllPayments();
        let all = (res.data || []).map((p) => ({
          ...p,
          tzDate: toCambodiaDate(p.paymentDate), // precompute Cambodia date
        }));

        // Sort once by paymentDate DESC
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

  // Memoized filtered list
  const filtered = useMemo(() => {
    const value = search.toLowerCase();
    return payments.filter(
      (p) =>
        isThisMonth(p.tzDate) &&
        ((p.customer?.name && p.customer.name.toLowerCase().includes(value)) ||
          (p.remark && p.remark.toLowerCase().includes(value)))
    );
  }, [payments, search]);

  // Memoized monthly total
  const monthlyTotal = useMemo(
    () => filtered.reduce((sum, p) => sum + Number(p.amount), 0),
    [filtered]
  );

  // Handlers
  const handleSearch = useCallback((e) => setSearch(e.target.value), []);
  const handleDelete = useCallback(
    async (id) => {
      if (
        window.confirm(
          "តើអ្នកពិតជាចង់លុបការបង់ប្រាក់នេះមែនទេ? | Are you sure to delete?"
        )
      ) {
        await paymentApi.removePayment(id);
        setPayments((prev) => prev.filter((p) => p.id !== id));
      }
    },
    []
  );

  return (
    <div className="payment-list">
      {loading ? (
        <div className="flex justify-center items-center py-10 text-gray-500">
          <FiLoader className="animate-spin mr-2" size={20} />
          កំពុងផ្ទុក...
        </div>
      ) : (
        <>
          {/* Search */}
          <input
            type="text"
            placeholder="ស្វែងរកតាមអតិថិជន ឬចំណាំ "
            value={search}
            onChange={handleSearch}
            className="search-bar"
          />

          {/* Monthly Total Label */}
          <div className="monthly-total">
            <strong>ប្រាក់បានទទួលសរុបក្នុងខែនេះ</strong> {monthlyTotal.toFixed(2)}$
          </div>

          {/* Content */}
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>មិនមានការបង់ប្រាក់ក្នុងខែនេះទេ</p>
            </div>
          ) : (
            <div className="card-list">
              {filtered.map((p) => (
                <div key={p.id} className="payment-card">
                  <h3>{p.customer?.name}</h3>
                  <p>
                    <strong>💵 ទឹកប្រាក់បង់:</strong> ${p.amount}
                  </p>
                  <p>
                    <strong>📅 កាលបវិច្ឆេទ:</strong> {p.tzDate.toLocaleString()}
                  </p>
                  <div className="card-actions">
                    <Link to={`/payments/edit/${p.id}`} className="btn btn-edit">
                      ✏️ កែប្រែ
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="btn btn-delete"
                    >
                      🗑️ លុប
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Button */}
          <Link to="/payments/add" className="btn btn-add">
            បន្ថែមការបង់ប្រាក់
          </Link>
        </>
      )}
    </div>
  );
};

export default PaymentList;