import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCustomer } from "../../api/customerApi.js";

export default function CustomerAdd() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await createCustomer(form); // ✅ use named export
      nav("/customers");
    } catch (err) {
      console.error(err);
      alert("មិនអាចបញ្ចូលអតិថិជនបានទេ!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">បង្កើតអតិថិជន</h1>

      <form className="space-y-3" onSubmit={handleSave}>
        <input
          type="text"
          name="name"
          placeholder="ឈ្មោះអតិថិជន"
          className="w-full border px-4 py-3 rounded-xl"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="លេខទូរស័ព្ទ"
          className="w-full border px-4 py-3 rounded-xl"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          type="text"
          name="address"
          placeholder="អាស័យដ្ឋាន"
          className="w-full border px-4 py-3 rounded-xl"
          value={form.address}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "កំពុងរក្សាទុក..." : "រក្សាទុក"}
        </button>
      </form>
    </div>
  );
}