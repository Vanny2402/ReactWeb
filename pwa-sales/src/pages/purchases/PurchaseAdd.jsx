import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPurchase } from "../../api/purchaseApi.js";
import { getAllProducts } from "../../api/productApi.js";
import moment from "moment-timezone";

export default function PurchaseAdd() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    supplier: "",
    productId: "",
    quantity: "",
    price: "",
    remark: "",
    purchaseDate: moment().tz("Asia/Phnom_Penh").format("YYYY-MM-DD"),
    purchaseTime: moment().tz("Asia/Phnom_Penh").format("HH:mm"),
  });

  // Load products
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllProducts();
        setProducts(res || []); // ✅ assume API returns array
      } catch (err) {
        console.error("Failed to load products", err);
        alert("មិនអាចទាញយកផលិតផលបានទេ");
      }
    })();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      // if (name === "productId") {
      //   const selected = products.find((p) => p.id === Number(value));
      //   if (selected) updated.price = selected.purchasePrice;
      // }
      return updated;
    });

    // ✅ Update purchasePrice on productTable when user inputs price
    if (name === "price" && form.productId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === Number(form.productId)
            ? { ...p, purchasePrice: Number(value) }
            : p
        )
      );
    }
  };

  
  // Add product to cart
  const handleAddToCart = () => {
    const product = products.find((p) => p.id === Number(form.productId));
    if (!product || !form.quantity || !form.price) {
      alert("សូមបំពេញព័ត៌មានផលិតផល ចំនួន និងតម្លៃ មុនពេលបន្ថែមទៅកន្ត្រក!");
      return;
    }

    const lineTotal = Number(form.quantity) * Number(form.price);

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.product.id === product.id);
      if (existingIndex >= 0) {
        // ✅ update quantity if product already exists
        const updated = [...prev];
        updated[existingIndex].quantity += Number(form.quantity);
        updated[existingIndex].lineTotal =
          updated[existingIndex].quantity * updated[existingIndex].price;
        return updated;
      }
      return [
        ...prev,
        {
          product: { id: product.id, name: product.name },
          quantity: Number(form.quantity),
          price: Number(form.price),
          lineTotal,
        },
      ];
    });

    // Reset quantity only
    setForm((prev) => ({ ...prev, quantity: "" }));
  };

  const handleRemoveFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Build purchase payload
  const buildPurchasePayload = () => {
    const totalPrice = cartItems.reduce((sum, i) => sum + i.lineTotal, 0);
    const combinedDateTime = moment
      .tz(`${form.purchaseDate} ${form.purchaseTime}`, "YYYY-MM-DD HH:mm", "Asia/Phnom_Penh")
      .format("YYYY-MM-DDTHH:mm:ssZ");

    return {
      supplier: form.supplier,
      remark: form.remark,
      totalPrice,
      createdAt: combinedDateTime,
      items: cartItems.map((i) => ({
        product: { id: i.product.id },
        quantity: i.quantity,
        price: i.price,
        lineTotal: i.lineTotal,
      })),
    };
  };

  const handleSave = async () => {
    if (cartItems.length === 0) {
      alert("មិនអាចរក្សាទុកបានទេ ព្រោះអ្នកមិនបានបន្ថែមទំនិញទៅកន្ត្រក!");
      return;
    }

    setSaving(true);
    try {
      await createPurchase(buildPurchasePayload());
      alert("ការទិញបានបញ្ចូលដោយជោគជ័យ!");
      navigate("/purchases");
    } catch (err) {
      console.error("Save failed", err);
      alert("បញ្ហាក្នុងការបញ្ចូលទិញ");
      setSaving(false);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      {/* Supplier */}
      <input
        name="supplier"
        value={form.supplier}
        onChange={handleChange}
        placeholder="អ្នកផ្គត់ផ្គង់"
        className="w-full border rounded pl-2 py-2"
      />

      {/* Date & Time */}
      <div className="flex gap-4">
        <input
          type="date"
          name="purchaseDate"
          value={form.purchaseDate}
          onChange={handleChange}
          className="flex-1 border rounded py-3 pl-2 pr-2"
        />
        <input
          type="time"
          name="purchaseTime"
          value={form.purchaseTime}
          onChange={handleChange}
          className="flex-1 border rounded pl-2"
        />
      </div>

      {/* Product Selection */}
      <select
        name="productId"
        value={form.productId}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      >
        <option value="">ជ្រើសរើសផលិតផល</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* Quantity & Price */}
      <div className="flex gap-4">
        <input
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          type="number"
          placeholder="ចំនួន"
          className="flex-1 border rounded px-3 py-2"
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          type="number"
          placeholder="តម្លៃ"
          className="flex-1 border rounded px-3 py-2"
        />
      </div>

      {/* Add to Cart */}
      <div className="text-right">
        <button
          onClick={handleAddToCart}
          className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          <span>🛒</span> បន្ថែមទៅកន្ត្រក
        </button>
      </div>

      {/* Cart Table */}
      {cartItems.length > 0 && (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">ផលិតផល</th>
              <th className="border px-2 py-1">ចំនួន</th>
              <th className="border px-2 py-1">តម្លៃ</th>
              <th className="border px-2 py-1">សរុប</th>
              <th className="border px-2 py-1">លុប</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{item.product.name}</td>
                <td className="border px-2 py-1">{item.quantity}</td>
                <td className="border px-2 py-1">{formatCurrency(item.price)}</td>
                <td className="border px-2 py-1">{formatCurrency(item.lineTotal)}</td>
                <td className="border px-2 py-1 text-center">
                  <button
                    onClick={() => handleRemoveFromCart(idx)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                  >
                    លុប
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Remark */}
      <input
        name="remark"
        value={form.remark}
        onChange={handleChange}
        placeholder="ចំណាំ"
        className="w-full border rounded px-3 py-2"
      />

      {/* Save / Back */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          ថយក្រោយ
        </button>
        <button
          onClick={handleSave}
          disabled={saving || cartItems.length === 0}
          className={`px-4 py-2 rounded text-white ${cartItems.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
            }`}
        >
          {saving ? "កំពុងរក្សាទុក..." : "រក្សាទុក"}
        </button>
      </div>
    </div>
  );
}
