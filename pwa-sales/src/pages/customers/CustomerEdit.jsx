import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomerById, updateCustomer } from "../../api/customerApi";

export default function CustomerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load customer when page opens
  useEffect(() => {
    getCustomerById(id)
      .then((res) => {
        setForm(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load customer");
        navigate("/customers");
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setSaving(true);

    updateCustomer(id, form)
      .then(() => {
        alert("Customer updated!");
        navigate("/customers");
      })
      .catch(() => {
        alert("Error updating customer");
        setSaving(false);
      });
  };

  if (loading) return <p className="text-gray-600 text-center">កំពុងផ្ទុក...</p>;

  return (
    <div className="p-4 pb-24">
      <div className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Customer name"
        />

        <input
          className="w-full border p-2 rounded"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone number"
        />

        <input
          className="w-full border p-2 rounded"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
