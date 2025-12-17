import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomerById, updateCustomer } from "../../api/customerApi";

export default function CustomerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const customerId = Number(id);

  const [customer, setCustomer] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadCustomer = async () => {
      if (!id || Number.isNaN(customerId)) {
        setError("❌ Invalid customer ID");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getCustomerById(customerId);
        if (!data) {
          setError("❌ Customer not found");
          return;
        }
        setCustomer(data);
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      } catch (err) {
        console.error(err);
        setError("❌ មិនអាចទាញព័ត៌មានអតិថិជនបានទេ!");
      } finally {
        setLoading(false);
      }
    };
    loadCustomer();
  }, [id, customerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id || Number.isNaN(customerId)) {
      setError("❌ Invalid customer ID");
      return;
    }
    try {
      setSaving(true);
      await updateCustomer(customerId, form);
      alert("✅ Customer updated successfully!");
      navigate("/customers");
    } catch (err) {
      console.error(err);
      setError("❌ មិនអាចកែប្រែអតិថិជនបានទេ!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!customer) return <div className="p-4">No customer found</div>;

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded p-6">
      <h2 className="text-xl font-bold mb-4">កែប្រែអតិថិជន #{customer.id}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormRow label="ឈ្មោះ" name="name" value={form.name} onChange={handleChange} required />
        <FormRow label="លេខទូរស័ព្ទ" name="phone" value={form.phone} onChange={handleChange} />
        <FormRow label="អាសយដ្ឋាន" name="address" value={form.address} onChange={handleChange} />
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          {saving ? "កំពុងរក្សាទុក..." : "💾 រក្សាទុក"}
        </button>
      </form>
    </div>
  );
}

function FormRow({ label, ...props }) {
  return (
    <div>
      <label className="block text-gray-600 mb-1">{label}</label>
      <input type="text" {...props} className="w-full border rounded px-3 py-2" />
    </div>
  );
}
