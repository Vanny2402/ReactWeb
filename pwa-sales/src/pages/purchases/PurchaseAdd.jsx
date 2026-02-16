import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPurchase } from "../../api/purchaseApi.js";
import { getAllProducts } from "../../api/productApi.js";
import moment from "moment-timezone";

export default function PurchaseAdd() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [saving, setSaving] = useState(false);

  // ✅ Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const initialProductSet = useRef(false);

  const [form, setForm] = useState({
    supplier: "",
    productId: "",
    quantity: "",
    price: "",
    remark: "",
    purchaseDate: moment().tz("Asia/Phnom_Penh").format("YYYY-MM-DD"),
    purchaseTime: moment().tz("Asia/Phnom_Penh").format("HH:mm"),
  });

  // ================= LOAD PRODUCTS =================
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllProducts();
        setProducts(res || []);

        if (!initialProductSet.current) {
          const params = new URLSearchParams(location.search);
          const productIdFromQuery = params.get("productId");

          if (productIdFromQuery) {
            const selected = res.find(
              p => p.id === Number(productIdFromQuery)
            );

            if (selected) {
              setForm(prev => ({
                ...prev,
                productId: productIdFromQuery,
                price: selected.purchasePrice || ""
              }));
              setSearchTerm(selected.name);
              initialProductSet.current = true;
            }
          }
        }
      } catch (err) {
        console.error("Failed to load products", err);
        alert("មិនអាចទាញយកផលិតផលបានទេ");
      }
    })();
  }, [location.search]);

  // ================= CLOSE DROPDOWN =================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".product-combobox")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () =>
      document.removeEventListener("click", handleClickOutside);
  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === "productId") {
      const selected = products.find(p => p.id === Number(value));
      if (selected) {
        setForm(prev => ({
          ...prev,
          price: selected.purchasePrice || ""
        }));
        setSearchTerm(selected.name);
      }
    }

    if (name === "price" && form.productId) {
      setProducts(prev =>
        prev.map(p =>
          p.id === Number(form.productId)
            ? { ...p, purchasePrice: Number(value) }
            : p
        )
      );
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ================= ADD TO CART =================
  const handleAddToCart = () => {
    const product = products.find(
      p => p.id === Number(form.productId)
    );

    if (!product || !form.quantity || !form.price) {
      alert("សូមបំពេញព័ត៌មានផលិតផល ចំនួន និងតម្លៃ មុនពេលបន្ថែមទៅកន្ត្រក!");
      return;
    }

    const lineTotal =
      Number(form.quantity) * Number(form.price);

    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        i => i.product.id === product.id
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].quantity += Number(form.quantity);
        updated[existingIndex].lineTotal =
          updated[existingIndex].quantity *
          updated[existingIndex].price;
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

    setForm(prev => ({ ...prev, quantity: "" }));
  };

  const handleRemoveFromCart = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  // ================= BUILD PAYLOAD =================
  const buildPurchasePayload = () => {
    const totalPrice = cartItems.reduce(
      (sum, i) => sum + i.lineTotal,
      0
    );

    const combinedDateTime = moment
      .tz(
        `${form.purchaseDate} ${form.purchaseTime}`,
        "YYYY-MM-DD HH:mm",
        "Asia/Phnom_Penh"
      )
      .format("YYYY-MM-DDTHH:mm:ssZ");

    return {
      supplier: form.supplier,
      remark: form.remark,
      totalPrice,
      createdAt: combinedDateTime,
      items: cartItems.map(i => ({
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
      navigate("/purchases");
    } catch (err) {
      console.error("Save failed", err);
      alert("បញ្ហាក្នុងការបញ្ចូលទិញ");
      setSaving(false);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  // ================= UI =================
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

      {/* SEARCHABLE PRODUCT */}
      <div className="relative product-combobox">
        <input
          type="text"
          placeholder="ស្វែងរកផលិតផល..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          className="w-full border rounded px-3 py-2"
        />

        {showDropdown && searchTerm && (
          <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-y-auto shadow">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(p => (
                <li
                  key={p.id}
                  onClick={() => {
                    setForm(prev => ({
                      ...prev,
                      productId: p.id,
                      price: p.purchasePrice || ""
                    }));
                    setSearchTerm(p.name);
                    setShowDropdown(false);
                  }}
                  className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                >
                  {p.name}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-400">
                មិនមានផលិតផល
              </li>
            )}
          </ul>
        )}
      </div>

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
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          🛒 បន្ថែមទៅកន្ត្រក
        </button>
      </div>

      {/* ================= CART TABLE ================= */}
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
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
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
          className={`px-4 py-2 rounded text-white ${
            cartItems.length === 0
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
