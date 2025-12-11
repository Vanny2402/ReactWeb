import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProduct } from "../../api/productApi";
import { FiArrowLeft } from "react-icons/fi";

export default function ProductModify() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    productType: "",
    stock: "",
    remark: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  async function fetchProduct() {
    try {
      const res = await getProductById(id);
      setForm(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load product");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  }

  async function handleSave() {
    if (!form.productType) {
      alert("សូមជ្រើសរើសប្រភេទទំនិញ!");
      return;
    }

    setSaving(true);
    try {
      await updateProduct(id, form);
      alert("ទំនិញត្រូវបានកែប្រែដោយជោគជ័យ!");
      navigate("/products");
    } catch (err) {
      console.error(err);
      alert("Error updating product");
      setSaving(false);
    }
  }

  if (loading) return <p className="text-gray-600 text-center">កំពុងផ្ទុក...</p>;

  return (
    <div className="p-4 pb-24">
      {/* ✅ Form Fields */}
      <div className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="ឈ្មោះផលិតផល"
        />

        <input
          className="w-full border p-2 rounded"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="តម្លៃលក់"
          type="number"
        />

        <select
          className="w-full border px-4 py-3 rounded-xl"
          name="productType"
          value={form.productType}
          onChange={handleChange}
          required
        >
          <option value="">-- ជ្រើសរើសប្រភេទ --</option>
          <option value="ឡេ">ឡេ</option>
          <option value="សាប៊ួ">សាប៊ួ</option>
          <option value="ហ្វូម">ហ្វូម</option>
          <option value="ម្សៅ">ម្សៅ</option>
          <option value="ម៉ាស">ម៉ាស</option>
          <option value="ផ្សេងៗ">ផ្សេងៗ</option>
        </select>

        <input
          className="w-full border p-2 rounded"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="ចំនួនស្តុក"
          type="number"
        />

        <input
          className="w-full border p-2 rounded"
          name="remark"
          value={form.remark}
          onChange={handleChange}
          placeholder="ចាំណាំ"
        />
      </div>

      {/* ✅ Split Back & Save Buttons */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
        >
          ថយក្រោយ
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {saving ? "កំពុងផ្ទុក..." : "រក្សាទុក"}
        </button>
      </div>
    </div>
  );
}
