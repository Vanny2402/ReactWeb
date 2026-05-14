import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllProducts } from "../../api/productApi.js";
import { getPurchaseById, updatePurchase } from "../../api/purchaseApi.js";
import moment from "moment-timezone";

export default function PurchaseEdit() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    supplier: "",
    productId: "",
    quantity: "",
    price: "",
    remark: "",
    purchaseDate: "",
    purchaseTime: "",
  });

  // Load products + purchase
  // Load products + purchase
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        // ✅ Fetch products
        const productList = await getAllProducts();
        setProducts(productList || []);

        // ✅ Fetch purchase
        const purchaseRes = await getPurchaseById(id);
        const purchase = purchaseRes?.data?.purchase || purchaseRes?.data || purchaseRes;

        if (!purchase || !purchase.createdAt) {
          console.error("Purchase not found or invalid response", purchaseRes);
          return;
        }

        const dt = moment(purchase.createdAt).tz("Asia/Phnom_Penh");
        setForm((prev) => ({
          ...prev,
          supplier: purchase.supplier || "",
          remark: purchase.remark || "",
          purchaseDate: dt.format("YYYY-MM-DD"),
          purchaseTime: dt.format("HH:mm"),
        }));

        // ✅ Use productList here, not products state
        setCartItems(
          (purchase.items || []).map((i) => ({
            product: {
              id: i.productId || i.product?.id,
              name: i.name || "មិនស្គាល់",
            },
            quantity: i.quantity,
            price: i.price,
            lineTotal: i.lineTotal,
          }))
        );

      } catch (err) {
        console.error("Failed to load purchase", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "productId") {
        const selected = products.find((p) => p.id === Number(value));
        if (selected) updated.price = selected.price;
      }
      return updated;
    });
  };

  // Add or update product in cart
  const handleAddOrUpdate = () => {
    const product = products.find((p) => p.id === Number(form.productId));
    if (!product || !form.quantity || !form.price) {
      alert("សូមបំពេញព័ត៌មានផលិតផល ចំនួន និងតម្លៃ!");
      return;
    }

    const lineTotal = Number(form.quantity) * Number(form.price);

    setCartItems((prev) => [
      ...prev,
      {
        product: { id: product.id, name: product.name },
        quantity: Number(form.quantity),
        price: Number(form.price),
        lineTotal,
      },
    ]);

    setForm((prev) => ({ ...prev, productId: "", quantity: "", price: "" }));
  };

  const handleRemoveFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (cartItems.length === 0) {
      alert("មិនអាចរក្សាទុកបានទេ ព្រោះអ្នកមិនបានបន្ថែមទំនិញ!");
      return;
    }

    const totalPrice = cartItems.reduce((sum, i) => sum + i.lineTotal, 0);
    const combinedDateTime = moment
      .tz(`${form.purchaseDate} ${form.purchaseTime}`, "YYYY-MM-DD HH:mm", "Asia/Phnom_Penh")
      .format("YYYY-MM-DDTHH:mm:ssZ");

    const purchase = {
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

    setSaving(true);
    try {
      await updatePurchase(id, purchase);
      alert("ការទិញបានកែប្រែដោយជោគជ័យ!");
      navigate("/purchases");
    } catch (err) {
      console.error(err);
      alert("បញ្ហាក្នុងការកែប្រែទិញ");
      setSaving(false);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  if (loading) {
    return (
      <div className="p-6 w-full text-center text-lg">
        ⏳ កំពុងផ្ទុកទិន្នន័យ...
      </div>
    );
  }

  return (
    <div className="p-6 w-full space-y-6">
      {/* Supplier + Date/Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          name="supplier"
          value={form.supplier}
          onChange={handleChange}
          placeholder="អ្នកផ្គត់ផ្គង់"
          className="border rounded px-4 py-4 text-lg w-full"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            name="purchaseDate"
            value={form.purchaseDate}
            onChange={handleChange}
            className="border rounded px-4 py-4 text-lg w-full"
          />
          <input
            type="time"
            name="purchaseTime"
            value={form.purchaseTime}
            onChange={handleChange}
            className="border rounded px-4 py-4 text-lg w-full"
          />
        </div>
      </div>

      {/* Product Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <select
          name="productId"
          value={form.productId}
          onChange={handleChange}
          className="border rounded px-4 py-4 text-lg w-full"
        >
          <option value="">ជ្រើសរើសផលិតផល</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          type="number"
          placeholder="ចំនួន"
          className="border rounded px-4 py-4 text-lg w-full"
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          type="number"
          placeholder="តម្លៃ"
          className="border rounded px-4 py-4 text-lg w-full"
        />
      </div>

      {/* Add to Cart */}
      <div className="text-right">
        <button
          onClick={handleAddOrUpdate}
          className="inline-flex items-center gap-2 bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700 transition text-lg"
        >
          <span>🛒</span> បន្ថែម/កែប្រែទំនិញ
        </button>
      </div>

      {/* Cart Table */}
      {cartItems.length > 0 && (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full border mt-6 text-sm md:text-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-2 md:px-4 md:py-3">ផលិតផល</th>
                <th className="border px-2 py-2 md:px-4 md:py-3">ចំនួន</th>
                <th className="border px-2 py-2 md:px-4 md:py-3">តម្លៃ</th>
                <th className="border px-2 py-2 md:px-4 md:py-3">សរុប</th>
                <th className="border px-2 py-2 md:px-4 md:py-3">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-2 md:px-4 md:py-3">{item.product.name}</td>
                  <td className="border px-2 py-2 md:px-4 md:py-3">{item.quantity}</td>
                  <td className="border px-2 py-2 md:px-4 md:py-3">{formatCurrency(item.price)}</td>
                  <td className="border px-2 py-2 md:px-4 md:py-3">{formatCurrency(item.lineTotal)}</td>
                  <td className="border px-2 py-2 md:px-4 md:py-3 text-center">
                    <button
                      onClick={() => handleRemoveFromCart(idx)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                    >
                      លុប
                    </button>
                  </td>
                </tr>
              ))}
              {/* Grand Total Row */}
              <tr className="bg-gray-50 font-semibold">
                <td colSpan="3" className="text-left pl-2 md:pr-4">សរុប:</td>
                <td className="border px-2 py-2 md:px-4 md:py-3 text-left">
                  {formatCurrency(cartItems.reduce((sum, i) => sum + i.lineTotal, 0))}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Remark */}
      <input
        name="remark"
        value={form.remark}
        onChange={handleChange}
        placeholder="ចំណាំ"
        className="w-full border rounded px-4 py-4 text-lg"
      />

      {/* Save / Back */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 text-gray-800 px-6 py-3 rounded text-lg"
        >
          ថយក្រោយ
        </button>
        <button
          onClick={handleSave}
          disabled={saving || cartItems.length === 0}
          className={`px-6 py-3 rounded text-white text-lg ${cartItems.length === 0
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
