import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import customerApi from "../../api/customerApi";
import paymentApi from "../../api/paymentApi";
import "./PaymentList.css";
import { useLocation } from "react-router-dom";
import {formatDateForInput} from "../../utils/formatAmount";



// Utility: format date for datetime-local input
// const formatDateForInput = (date) => {
//   const options = {
//     timeZone: "Asia/Phnom_Penh",
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: false,
//   };
//   const parts = new Intl.DateTimeFormat("en-GB", options).formatToParts(date);
//   const get = (type) => parts.find((p) => p.type === type).value;
//   return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
// };
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

  const [formData, setFormData] = useState({
    customerId: id || "",
    amount: state?.amount ?? "",
    paymentDate: formatDateForInput(new Date()),
    remark: "",
  });

  const fetchCustomerDebt = async (customerId) => {
    if (!customerId) return 0;
    try {
      const data = await customerApi.getCustomerById(customerId); // Make sure API returns totalDebt
      const debt = data.totalDebt || 0;
      setTotalDebt(debt); // store in state
      return debt;
    } catch (err) {
      console.error("Failed to fetch customer debt", err);
      setTotalDebt(0);
      return 0;
    }
  };

  const [totalDebt, setTotalDebt] = useState(0);
  // Fetch customers
  useEffect(() => {
    customerApi
      .getAllCustomers()
      .then((data) => {
        const customerList = Array.isArray(data) ? data : [];
        setCustomers(customerList);
        // If there's an initial customerId (from URL param or state), fetch their debt
        if (formData.customerId) {
          const initialCustomer = customerList.find(
            (c) => c.id === parseInt(formData.customerId, 10)
          );
          if (initialCustomer) {
            fetchCustomerDebt(formData.customerId).then((debt) =>
              setFormData((prev) => ({ ...prev, amount: debt }))
            );
          }
        }
      })
      .catch(() => setError("មិនអាចទាញយកអតិថិជនបានទេ!"));
  }, []);

  // Handle input changes
  const handleChange = ({ target: { name, value } }) => {
    let val = value;

    // Validate amount
    if (name === "amount") {
      if (Number(val) > totalDebt) {
        setError(`❌ ទឹកប្រាក់បង់មិនអាចលើស ${totalDebt} បានទេ!`);
        val = totalDebt; 
      } else {
        setError("");
      }
    }

    setFormData((prev) => ({ ...prev, [name]: val }));
    // Auto-fill amount when changing customer
    if (name === "customerId") {
      fetchCustomerDebt(val).then((debt) =>
        setFormData((prev) => ({ ...prev, amount: debt }))
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (Number(formData.amount) > totalDebt) {
      setError(`មិនអាចបង់ប្រាក់លើស ${totalDebt} បានទេ!`);
      return;
    }
    setLoading(true);

    try {
      const payload = {
        customer: { id: parseInt(formData.customerId, 10) },
        amount: Number(formData.amount),
        paymentDate: formData.paymentDate,
        remark: formData.remark,
      };

      await paymentApi.createPayment(payload);
      // alert("ការបង់ប្រាក់បានបន្ថែមដោយជោគជ័យ!");
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
        <FormGroup label="អតិថិជន" >
          <select className="w-full border rounded-xl pl-4 pr-3 py-2"
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

        <FormGroup label="ទឹកប្រាក់$">
          <input className="w-full border rounded-xl pl-4 pr-3 py-2"
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
            <input className="w-full border rounded-xl pl-4 pr-3 py-2"
              type="datetime-local"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup label="ចំណាំ">
            <input className="w-full border rounded-xl pl-4 pr-3 py-2"
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
