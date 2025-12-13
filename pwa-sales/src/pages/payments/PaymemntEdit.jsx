import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import customerApi from "../../api/customerApi";   // ✅ for customer list
import paymentApi from "../../api/paymentApi";     // ✅ for payment CRUD

const PaymentEdit = () => {
  const { id } = useParams();
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customerId: "",
    amount: "",
    paymentDate: "",
    remark: "",
  });

  useEffect(() => {
    // Load customers for dropdown
    customerApi.getAllCustomers().then((res) => setCustomers(res.data));

    // Load payment details by ID
    paymentApi.getPaymentById(id).then((res) => {
      const { customer, amount, paymentDate, remark } = res.data;
      setFormData({
        customerId: customer.id,
        amount,
        paymentDate: paymentDate.slice(0, 16), // format for datetime-local
        remark: remark || "",
      });
    });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await paymentApi.updatePayment(id, formData);   // ✅ use wrapper
    alert("Payment updated!");
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <label>Customer</label>
      <select
        name="customerId"
        value={formData.customerId}
        onChange={handleChange}
        required
      >
        <option value="">Select Customer</option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <label>Amount</label>
      <input
        type="number"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        required
      />

      <label>Payment Date</label>
      <input
        type="datetime-local"
        name="paymentDate"
        value={formData.paymentDate}
        onChange={handleChange}
      />

      <label>Remark</label>
      <textarea
        name="remark"
        value={formData.remark}
        onChange={handleChange}
        placeholder="Optional notes..."
      />

      <button type="submit">Update Payment</button>
    </form>
  );
};

export default PaymentEdit;
