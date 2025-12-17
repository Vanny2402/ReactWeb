import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { FiLoader } from "react-icons/fi";

import saleApi from "../../api/saleApi";
import { getAllProducts } from "../../api/productApi";
import { getAllCustomers } from "../../api/customerApi";

export default function ProductSale() {
  const navigate = useNavigate();
  const location = useLocation();

  // Read query params correctly
  const query = new URLSearchParams(location.search);
  const productId = query.get("productId");
  const customerId = query.get("customerId");

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const [form, setForm] = useState({
    productId: "",
    customerId: "",
    qty: "",
    price: "",
    paidAmount: "",
    remark: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [customerLocked, setCustomerLocked] = useState(false);
  const [error, setError] = useState(null);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const [pRes, cRes] = await Promise.all([
          getAllProducts(),
          getAllCustomers(),
        ]);

        setProducts(Array.isArray(pRes) ? pRes : []);
        setCustomers(Array.isArray(cRes) ? cRes : []);

        // Auto-select customer
        if (customerId) {
          setForm(f => ({ ...f, customerId }));
          setCustomerLocked(true);
        }

        // Auto-select product
        if (productId) {
          const p = pRes.find(x => x.id === Number(productId));
          if (p) {
            setForm(f => ({
              ...f,
              productId: p.id,
              price: p.price,
            }));
          }
        }
      } catch (err) {
        console.error(err);
        setError("មិនអាចទាញទិន្នន័យបានទេ");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [productId, customerId]);

  /* ---------------- FORM CHANGE ---------------- */
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      setForm(prev => {
        const next = { ...prev, [name]: value };

        if (name === "productId") {
          const p = products.find(x => x.id === Number(value));
          next.price = p ? p.price : "";
        }

        return next;
      });
    },
    [products]
  );

  /* ---------------- ADD TO CART ---------------- */
  const handleAddToCart = () => {
    if (!form.customerId) return alert("សូមជ្រើសរើសអតិថិជន");
    if (!form.productId || !form.qty || !form.price)
      return alert("សូមបញ្ចូល ផលិតផល ចំនួន និង តម្លៃ!");

    const product = products.find(p => p.id === Number(form.productId));
    if (!product) return;

    if (product.stock === 0) {
      return alert(`ផលិតផល "${product.name}" អស់ពីស្តុកហើយ!`);
    }

    const qty = Number(form.qty);
    const price = Number(form.price);

    if (qty > product.stock) {
      return alert(`ចំនួនស្តុកមានត្រឹមតែ ${product.stock} ប៉ុណ្ណោះ!`);
    }

    setCartItems(prev => [
      ...prev,
      {
        product: { id: product.id, name: product.name },
        qty,
        price,
        lineTotal: qty * price,
      },
    ]);

    setCustomerLocked(true);
    setForm(f => ({ ...f, qty: "" }));
  };

  /* ---------------- REMOVE ITEM ---------------- */
  const handleRemove = index => {
    setCartItems(prev => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) setCustomerLocked(false);
      return next;
    });
  };

  /* ---------------- TOTALS ---------------- */
  const total = useMemo(
    () => cartItems.reduce((s, i) => s + i.lineTotal, 0),
    [cartItems]
  );

  const paid = Number(form.paidAmount || 0);
  const debt = total - paid;

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    if (!form.customerId || cartItems.length === 0)
      return alert("សូមបញ្ចូលទៅក្នុងកន្ត្រកជាមុន!");

    if (paid < 0 || paid > total)
      return alert("ទឹកប្រាក់បង់មិនត្រឹមត្រូវ");

    const payload = {
      customer: { id: Number(form.customerId) },
      paidAmount: paid,
      remark: form.remark,
      items: cartItems.map(i => ({
        product: { id: i.product.id },
        qty: i.qty,
        price: i.price,
      })),
    };

    try {
      setSaving(true);
      await saleApi.createSale(payload);
      alert("រក្សាទុកជោគជ័យ");
      navigate(`/customers/${form.customerId}`);
    } catch (err) {
      console.error(err);
      alert("បរាជ័យ");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- UI ---------------- */
  if (loading)
    return (
      <div className="space-y-3">
        <div className="flex justify-center py-10 text-gray-500">
          <FiLoader className="animate-spin mr-2" />
          កំពុងផ្ទុក...
        </div>
      </div>
    );

  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <SelectRow
        label="អតិថិជន"
        name="customerId"
        value={form.customerId}
        onChange={handleChange}
        disabled={customerLocked}
        options={customers}
      />

      <SelectRow
        label="ផលិតផល"
        name="productId"
        value={form.productId}
        onChange={handleChange}
        options={products}
      />

      <InputRow label="ចំនួន" name="qty" value={form.qty} onChange={handleChange} />
      <InputRow label="តម្លៃ" name="price" value={form.price} onChange={handleChange} />

      <button
        onClick={handleAddToCart}
        className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2 rounded"
      >
        <ShoppingCartIcon className="h-5 w-5" />
        បន្ថែមទៅកន្ត្រក
      </button>

      {cartItems.length > 0 && (
        <CartTable items={cartItems} onRemove={handleRemove} total={total} debt={debt} />
      )}

      <InputRow label="ទឹកប្រាក់បង់" name="paidAmount" value={form.paidAmount} onChange={handleChange} />
      <InputRow label="ចំណាំ" name="remark" value={form.remark} onChange={handleChange} />

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        {saving ? "កំពុងរក្សាទុក..." : "រក្សាទុក"}
      </button>

      <button
        onClick={() => navigate(`/customers/${form.customerId}`)}
        className="w-full bg-gray-500 text-white py-2 rounded"
      >
        ⬅️ ត្រឡប់ទៅអតិថិជន
      </button>
    </div>
  );
}

/* ---------------- REUSABLE COMPONENTS ---------------- */

function SelectRow({ label, options = [], ...props }) {
  const safeOptions = Array.isArray(options) ? options : [];

  return (
    <div className="flex gap-3">
      <label className="w-32">{label}</label>
      <select {...props} className="flex-1 border rounded px-3 py-2">
        <option value="">ជ្រើសរើស</option>
        {safeOptions.map(o => (
          <option key={o.id} value={o.id}>{o.name}</option>
        ))}
      </select>
    </div>
  );
}

function InputRow({ label, ...props }) {
  return (
    <div className="flex gap-3">
      <label className="w-32">{label}</label>
      <input {...props} className="flex-1 border rounded px-3 py-2" />
    </div>
  );
}

function CartTable({ items, onRemove, total, debt }) {
  return (
    <table className="w-full border">
      <thead className="bg-gray-100">
        <tr>
          <th>ផលិតផល</th>
          <th>ចំនួន</th>
          <th>តម្លៃ</th>
          <th>សរុប</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {items.map((i, idx) => (
          <tr key={idx}>
            <td>{i.product.name}</td>
            <td>{i.qty}</td>
            <td>{i.price}</td>
            <td>{i.lineTotal}</td>
            <td>
              <button
                onClick={() => onRemove(idx)}
                className="text-red-600 hover:underline"
              >
                ❌
              </button>
            </td>
          </tr>
        ))}

        <tr className="font-semibold bg-gray-50">
          <td colSpan="3" className="text-right pr-4">សរុប:</td>
          <td className="text-right pr-4 text-red-600 font-semibold">{total}</td>
          <td />
        </tr>

        <tr className="bg-gray-50">
          <td colSpan="3" className="text-right pr-4">ជំពាក់:</td>
          <td className="text-right pr-4 text-red-600 font-semibold">{debt}</td>
          <td />
        </tr>
      </tbody>
    </table>
  );
}
