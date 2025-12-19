import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import customerApi from "../../api/customerApi";
import paymentApi from "../../api/paymentApi";
import "./PaymentList.css";
import { useLocation } from "react-router-dom";


// Utility: format date for datetime-local input
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

// Reusable form group (label + input/select)
const FormGroup = ({ label, children }) => (
  <div className="form-group">
    <label>{label}</label>
    {children}
  </div>
);



const PaymentAdd = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { state } = useLocation(); 
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const [formData, setFormData] = useState({
  //   customerId: id || "",
  //   amount: "",
  //   paymentDate: formatDateForInput(new Date()),
  //   remark: "",
  // });

const [formData, setFormData] = useState({
  customerId: id || "",
  amount: state?.amount ?? "", // ✅ auto-fill once
  paymentDate: formatDateForInput(new Date()),
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
  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        paymentDate: formData.paymentDate,
        remark: formData.remark,
      };

      await paymentApi.createPayment(payload);
      alert("ការបង់ប្រាក់បានបន្ថែមដោយជោគជ័យ!");
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
        {error && <p className="error-text">{error}</p>}

        <FormGroup label="អតិថិជន">
          <select
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            required
            disabled={!!id}
          >
            <option value="">ជ្រើសរើសអតិថិជន</option>
            {customers.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </FormGroup>

        <FormGroup label="ទឹកប្រាក់">
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0.01"
            step="0.01"
          />
        </FormGroup>

        <div className="form-row">
          <FormGroup label="កាលបរិច្ឆេទ">
            <input
              type="datetime-local"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup label="ចំណាំ">
            <input
              type="text"
              name="remark"
              value={formData.remark}
              onChange={handleChange}
            />
          </FormGroup>
        </div>

        <button type="submit" className="btn btn-submit" disabled={loading}>
          {loading ? "កំពុងរក្សាទុក..." : "រក្សាទុក"}
        </button>
      </form>
    </div>
  );
};

export default PaymentAdd;
