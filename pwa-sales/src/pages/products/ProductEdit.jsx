import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProduct } from "../../api/productApi";
import { FiLoader } from "react-icons/fi";

export default function ProductModify() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    productType: "",
    stock: "",
    remark: "",
    productColor: "",
    purchasePrice: "",
  })

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  async function fetchProduct() {
    try {
      const res = await getProductById(id);
      setForm(res); // <-- FIXED
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

  if (loading) return <div className="flex justify-center items-center h-screen text-gray-600">
    <FiLoader className="animate-spin mr-2" size={30} />
    កំពុងផ្ទុក...
  </div>

  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* ✅ Form Fields */}
      <h6 className="text-lg font-semibold text-center text-gray-700 mb-4">
        កែប្រែទំនិញ
      </h6>

      <div className="space-y-3">
        {/* Reusable row style: label left, input right */}
        <div className="flex items-center gap-3">
          <label htmlFor="name" className="w-32 text-sm font-medium">ឈ្មោះ</label>
          <input
            id="name"
            className="flex-1 border rounded px-3 py-2"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="ឈ្មោះផលិតផល"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="price" className="w-32 text-sm font-medium">តម្លៃលក់</label>
          <input
            id="price"
            className="flex-1 border rounded px-3 py-2"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="តម្លៃលក់"
            type="number"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="productType" className="w-32 text-sm font-medium">ប្រភេទ</label>
          <select
            id="productType"
            className="flex-1 border rounded px-3 py-2"
            name="productType"
            value={form.productType}
            onChange={handleChange}
            required
          >
            <option value=""> ជ្រើសរើស </option>
            <option value="ឡេ">ឡេ</option>
            <option value="សាប៊ួ">សាប៊ួ</option>
            <option value="ហ្វូម">ហ្វូម</option>
            <option value="ម្សៅ">ម្សៅ</option>
            <option value="ម៉ាស">ម៉ាស</option>
            <option value="ផ្សេងៗ">ផ្សេងៗ</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="productColor" className="w-32 text-sm font-medium">ពណ៌</label>
          <input
            id="productColor"
            className="flex-1 border rounded px-3 py-2"
            name="productColor"
            value={form.productColor}
            onChange={handleChange}
            placeholder="ពណ៌"
            type="text"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="purchasePrice" className="w-32 text-sm font-medium">តម្លៃទិញចូល</label>
          <input
            id="purchasePrice"
            className="flex-1 border rounded px-3 py-2"
            name="purchasePrice"
            value={form.purchasePrice}
            onChange={handleChange}
            placeholder="តម្លៃទិញចូល"
            type="number"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="stock" className="w-32 text-sm font-medium">ស្តុក</label>
          <input
            id="stock"
            className="flex-1 border rounded px-3 py-2"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            placeholder="ចំនួនស្តុក"
            type="number"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="remark" className="w-32 text-sm font-medium">ចំណាំ</label>
          <input
            id="remark"
            className="flex-1 border rounded px-3 py-2"
            name="remark"
            value={form.remark}
            onChange={handleChange}
            placeholder="ចំណាំ"
          />
        </div>
      </div>

      {/* ✅ Buttons */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition"
        >
          ថយក្រោយ
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {saving ? "កំពុងផ្ទុក..." : "រក្សាទុក"}
        </button>
      </div>
    </div>
  );
}
