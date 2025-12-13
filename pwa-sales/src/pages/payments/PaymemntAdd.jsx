import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import customerApi from "../../api/customerApi";
import paymentApi from "../../api/paymentApi";
import "./PaymentList.css";

// Utility: format date for datetime-local input in Cambodia timezone
const formatDateForInput = (date) => {
  const options = {
    timeZone: "Asia/Phnom_Penh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const parts = new Intl.DateTimeFormat("en-GB", options).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type).value;

  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
};

const PaymentAdd = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    customerId: "",
    amount: "",
    paymentDate: formatDateForInput(new Date()), // auto-select Now in Cambodia timezone
    remark: "",
  });

  // Fetch customers
  useEffect(() => {
    customerApi
      .getAllCustomers()
      .then((data) => setCustomers(Array.isArray(data) ? data : []))
      .catch(() => setError("មិនអាចទាញយកអតិថិជនបានទេ!"));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        customer: { id: parseInt(formData.customerId, 10) },
        amount: Number(formData.amount),
        paymentDate: formData.paymentDate, // already in Cambodia timezone format
        remark: formData.remark,
      };

      await paymentApi.createPayment(payload);

      alert("💚 ការបង់ប្រាក់បានបន្ថែមដោយជោគជ័យ!");
      navigate("/payments");
    } catch (err) {
      console.error(err);
      setError("❌ កំហុស! មិនអាចរក្សាទុកការបង់ប្រាក់បានទេ។");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-add">
      <form onSubmit={handleSubmit} className="form-card">
        {error && <p style={{ color: "red", marginBottom: 10 }}>{error}</p>}

        {/* CUSTOMER */}
        <div className="form-group">
          <label>អតិថិជន</label>
          <select
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            required
          >
            <option value="">ជ្រើសរើសអតិថិជន</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* AMOUNT */}
        <div className="form-group">
          <label>ចំនួន</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        {/* DATE + REMARK */}
        <div className="form-row">
          <div className="form-group">
            <label>កាលបរិច្ឆេទ</label>
            <input
              type="datetime-local"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>ចំណាំ</label>
            <input
              type="text"
              name="remark"
              value={formData.remark}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button type="submit" className="btn btn-submit" disabled={loading}>
          {loading ? "កំពុងរក្សាទុក..." : "រក្សាទុក"}
        </button>
      </form>
    </div>
  );
};

export default PaymentAdd;
