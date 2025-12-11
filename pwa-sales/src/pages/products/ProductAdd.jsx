import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../api/productApi";

export default function ProductAdd() {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [productColor, setProductColor] = useState("");
  const [productType, setProductType] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);

    // ✅ Validate productType before saving
    if (!productType) {
      alert("សូមជ្រើសរើសប្រភេទទំនិញ!");
      setLoading(false);
      return;
    }

    try {
      await createProduct({
        name,
        productColor,
        productType,
        remark,
      });

      nav("/products");
    } catch (err) {
      console.error(err);
      alert("មិនអាចបញ្ចូលទំនិញបានទេ!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">បង្កើតផលិតផលថ្មី</h1>

      <form className="space-y-3" onSubmit={handleSave}>

        <input
          type="text"
          placeholder="ឈ្មោះផលិតផល"
          className="w-full border px-4 py-3 rounded-xl"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="ពណ៌ផលិតផល"
          className="w-full border px-4 py-3 rounded-xl"
          value={productColor}
          onChange={(e) => setProductColor(e.target.value)}
        />

        {/* ✅ Dropdown for productType */}
        <select
          className="w-full border px-4 py-3 rounded-xl"
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
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
          type="text"
          placeholder="ចំណាំ"
          className="w-full border px-4 py-3 rounded-xl"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
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

