import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import paymentApi from "../../api/paymentApi";
import { FiLoader, FiUser, FiDollarSign, FiCalendar, FiFileText } from "react-icons/fi";
import {formdateForm} from "../../utils/formatAmount";


const PaymentEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    amount: "",
    remark: "",
    paymentDate: "",
  });
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    const loadPayment = async () => {
      try {
        const res = await paymentApi.getPaymentById(id);
        const data = res.data;
        setPayment(data);

        setForm({
          amount: data.amount || "",
          remark: data.remark || "",          
          paymentDate: data.paymentDate ? formdateForm(data.paymentDate) : "",
        });
      } catch (err) {
        console.error(err);
        alert("❌ មិនអាចទាញយកការបង់ប្រាក់បានទេ!");
      } finally {
        setLoading(false);
      }
    };
    loadPayment();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const localDate = new Date(form.paymentDate);
      const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000); 
      await paymentApi.updatePayment(id, {
        id: payment.id,
        amount: Number(form.amount),
        remark: form.remark,
        paymentDate: utcDate.toISOString(), // store UTC
        // paymentDate: new Date(form.paymentDate).toISOString(),
        customerId: payment.customer?.id,

      });

      // alert("✅ ការកែប្រែជោគជ័យ!");
      navigate("/payments");
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert("❌ មិនអាចកែប្រែការបង់ប្រាក់បានទេ!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-80 z-50">
    <FiLoader className="animate-spin mr-2 text-gray-600" size={24} />
    <span className="text-gray-700">កំពុងដំណើរការ...</span>
  </div>
  if (!payment) return <div className="text-center py-10">No payment found</div>;
  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-700">
        ✏️ កែប្រែការបង់ប្រាក់ #{payment.id}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Customer (read-only) */}
        <div>
          <label className="flex items-center text-gray-600 mb-1">
            <FiUser className="mr-2" /> អតិថិជន
          </label>
          <input
            type="text"
            value={payment.customer?.name || ""}
            readOnly
            className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
          />
          <small className="text-gray-400">អតិថិជនមិនអាចកែប្រែ</small>
        </div>

        {/* Amount */}
        <div>
          <label className="flex items-center text-gray-600 mb-1">
            <FiDollarSign className="mr-2" /> ទឹកប្រាក់
          </label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Remark */}
        <div>
          <label className="flex items-center text-gray-600 mb-1">
            <FiFileText className="mr-2" /> ចំណាំ
          </label>
          <input
            type="text"
            name="remark"
            value={form.remark}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
            placeholder="ចំណាំ"
          />
        </div>

{/* Payment Date */}
<div>
  <label className="flex items-center text-gray-600 mb-1">
    <FiCalendar className="mr-2" /> កាលបរិច្ឆេទ
  </label>
<input
  type="datetime-local"
  name="paymentDate"
  value={form.paymentDate}
  onChange={handleChange}
  className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
  required
/>

</div>

{/* 
            <input className="w-full border rounded-xl pl-4 pr-3 py-2"
              type="datetime-local"
              name="paymentDate"
              value={form.paymentDate}
              onChange={handleChange}
            /> */}

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate("/payments")}
            className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
          >
            ថយក្រោយ
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`px-4 py-2 rounded text-white flex items-center justify-center
    ${saving ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {saving ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                កំពុងរក្សាទុក...
              </>
            ) : (
              "💾 រក្សាទុក"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentEdit;
