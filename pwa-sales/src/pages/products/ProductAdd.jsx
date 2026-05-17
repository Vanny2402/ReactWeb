import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../../api/productApi";
import StarIcon from '@mui/icons-material/Star';

function parsePrice(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return null;
  const n = Number(trimmed.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export default function ProductAdd() {
  const nav = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [productColor, setProductColor] = useState("");
  const [purchasePrice, setPriceIn] = useState("");
  const [price, setSalePrice] = useState("");
  const [productType, setProductType] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    if (!productType) {
      alert("សូមជ្រើសរើសប្រភេទទំនិញ!");
      return;
    }

    const purchase = parsePrice(purchasePrice);
    const sale = parsePrice(price);
    if (purchase == null || sale == null) {
      alert("សូមបញ្ចូលតម្លៃឱ្យបានត្រឹមត្រូវ (លេខប៉ុណ្ណោះ)");
      return;
    }

    setLoading(true);
    try {
      await createProduct({
        name,
        productColor,
        productType,
        remark,
        purchasePrice: purchase,
        price: sale,
      });

      await queryClient.invalidateQueries({ queryKey: ["products"] });
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
        <label className="block">
          ឈ្មោះផលិតផល <StarIcon style={{ color: "red", fontSize: "0.7rem" }} />
        </label>
        <input
          type="text"
          placeholder="ឈ្មោះផលិតផល"
          className="w-full border px-4 py-3 rounded-xl"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* ✅ Dropdown for productType */}
        <label className="block">
          ប្រភេទផលិតផល <StarIcon style={{ color: "red", fontSize: "0.7rem" }} />
        </label>
        <select
          className="w-full border px-4 py-3 rounded-xl"
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
          required
        >
          <option value=""> ជ្រើសរើសប្រភេទ </option>
          <option value="ឡេ">ឡេ</option>
          <option value="សាប៊ួ">សាប៊ួ</option>
          <option value="ហ្វូម">ហ្វូម</option>
          <option value="ម្សៅ">ម្សៅ</option>
          <option value="ម៉ាស">ម៉ាស</option>
          <option value="សេរ៉ូម">សេរ៉ូម</option>
          <option value="ស្ក្រាប់">ស្ក្រាប់</option>
          <option value="ស្ប៉ា">ស្ប៉ា</option>
          <option value="ក្រែម">ក្រែម</option>
          <option value="ប្រេង">ប្រេង</option>
          <option value="ទឹកអនាម័យ">ទឹកអនាម័យ</option>
          <option value="ទឹកអប់">ទឹកអប់</option>
          <option value="ផ្សេងៗ">ផ្សេងៗ</option>
        </select>
        <label className="block">
          តម្លៃទិញចូល <StarIcon style={{ color: "red", fontSize: "0.7rem" }} />
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          className="w-full border px-4 py-3 rounded-xl"
          value={purchasePrice}
          onChange={(e) => setPriceIn(e.target.value)}
          required
        />

        <label className="block">
          តម្លៃលក់ចេញ <StarIcon style={{ color: "red", fontSize: "0.7rem" }} />
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          className="w-full border px-4 py-3 rounded-xl"
          value={price}
          onChange={(e) => setSalePrice(e.target.value)}
          required
        />

        <label className="block">
          ពណ៌ផលិតផល
        </label>
        <input
          type="text"
          placeholder="ពណ៌ផលិតផល"
          className="w-full border px-4 py-3 rounded-xl"
          value={productColor}
          onChange={(e) => setProductColor(e.target.value)}
        />
        <label className="block">
          ចំណាំ
        </label>
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

