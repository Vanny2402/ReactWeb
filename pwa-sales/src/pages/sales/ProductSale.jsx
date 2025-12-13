import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment-timezone";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";

import { createSale } from "../../api/saleApi";
import { getAllProducts } from "../../api/productApi";
import { getAllCustomers } from "../../api/customerApi";

export default function ProductSale() {
    const { id } = useParams();
    const navigate = useNavigate();

    /* ===================== STATE ===================== */
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [customerLocked, setCustomerLocked] = useState(false);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        productId: "",
        customerId: "",
        qty: "",
        price: "",
        paidAmount: "",
        remark: "",
    });

    /* ===================== LOAD DATA ===================== */
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            // API RETURNS res.data (NOT axios response)
            const [productsData, customersData] = await Promise.all([
                getAllProducts(),
                getAllCustomers(),
            ]);

            setProducts(
                Array.isArray(productsData)
                    ? productsData
                    : productsData?.content || productsData?.data || []
            );

            setCustomers(
                Array.isArray(customersData)
                    ? customersData
                    : customersData?.content || customersData?.data || []
            );


            if (id && productsData?.length) {
                const selected = productsData.find(p => p.id === Number(id));
                if (selected) {
                    setForm(prev => ({
                        ...prev,
                        productId: selected.id,
                        price: selected.price,
                    }));
                }
            }
        } catch (err) {
            console.error(err);
            setError("មិនអាចទាញទិន្នន័យបានទេ");
        } finally {
            setLoading(false);
        }
    };

    /* ===================== FORM HANDLING ===================== */
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;

        setForm(prev => {
            const updated = { ...prev, [name]: value };

            if (name === "productId") {
                const selected = products.find(p => p.id === Number(value));
                if (selected) {
                    updated.price = selected.price;
                }
            }

            return updated;
        });
    }, [products]);

    /* ===================== CART ===================== */
    const handleAddToCart = () => {
        if (!form.customerId) {
            alert("សូមជ្រើសរើសអតិថិជនជាមុន!");
            return;
        }

        if (!form.productId || !form.qty || !form.price) {
            alert("សូមបំពេញទិន្នន័យផលិតផល!");
            return;
        }

        const product = products.find(p => p.id === Number(form.productId));
        if (!product) return;

        const qty = Number(form.qty);
        const price = Number(form.price);

        setCartItems(prev => [
            ...prev,
            {
                product: { id: product.id, name: product.name },
                qty,
                price,
                lineTotal: qty * price,
            }
        ]);

        setCustomerLocked(true);

        setForm(prev => ({
            ...prev,
            qty: "",
            price: product.price,
        }));
    };

    const handleRemoveFromCart = (index) => {
        setCartItems(prev => {
            const updated = prev.filter((_, i) => i !== index);
            if (updated.length === 0) {
                setCustomerLocked(false);
            }
            return updated;
        });
    };

    /* ===================== SAVE ===================== */
    const handleSave = async () => {
        if (!form.customerId || cartItems.length === 0) {
            alert("សូមជ្រើសរើសអតិថិជន និងបន្ថែមផលិតផល!");
            return;
        }

        const totalPrice = cartItems.reduce((sum, i) => sum + i.lineTotal, 0);
        const paidAmount = Number(form.paidAmount || 0);

        const saleData = {
            customer: { id: Number(form.customerId) },
            remark: form.remark,
            items: cartItems.map(i => ({
                product: { id: i.product.id },
                qty: i.qty,
                price: i.price,
            })),
            totalPrice,
            paidAmount,
            debt: totalPrice - paidAmount,
            saleTime: moment().tz("Asia/Phnom_Penh").format(),
        };

        try {
            setSaving(true);
            await createSale(saleData);
            alert("ការលក់ត្រូវបានបង្កើតដោយជោគជ័យ!");
            navigate("/sales");
        } catch (err) {
            console.error(err);
            alert("បង្កើតការលក់បរាជ័យ");
            setSaving(false);
        }
    };

    /* ===================== RENDER ===================== */
    if (loading) {
        return <div className="p-4">កំពុងផ្ទុកទិន្នន័យ...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600">{error}</div>;
    }

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

            <div className="flex justify-end">
                <button
                    onClick={handleAddToCart}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
                >
                    <ShoppingCartIcon className="h-5 w-5" />
                    បន្ថែមទៅកន្ត្រក
                </button>
            </div>

            {cartItems.length > 0 && (
                <CartTable items={cartItems} onRemove={handleRemoveFromCart} />
            )}

            <InputRow
                name="paidAmount"
                value={form.paidAmount}
                onChange={handleChange}
                placeholder="ទឹកប្រាក់បង់"
            />

            <InputRow
                name="remark"
                value={form.remark}
                onChange={handleChange}
                placeholder="ចំណាំ"
            />

            <div className="flex gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="flex-1 bg-gray-200 py-2 rounded"
                >
                    ថយក្រោយ
                </button>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-green-600 text-white py-2 rounded"
                >
                    {saving ? "កំពុងរក្សាទុក..." : "រក្សាទុក"}
                </button>
            </div>
        </div>
    );
}

/* ===================== REUSABLE UI ===================== */

function SelectRow({ label, options = [], ...props }) {
  const safeOptions = Array.isArray(options) ? options : [];

  return (
    <div className="flex items-center gap-3">
      <label className="w-32 text-sm font-medium">{label}</label>
      <select {...props} className="flex-1 border rounded px-3 py-2">
        <option value="">ជ្រើសរើស</option>
        {safeOptions.map(o => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </div>
  );
}


function InputRow({ label, ...props }) {
    return (
        <div className="flex items-center gap-3">
            {label && <label className="w-32 text-sm font-medium">{label}</label>}
            <input {...props} className="flex-1 border rounded px-3 py-2" />
        </div>
    );
}

function CartTable({ items, onRemove }) {
    const total = items.reduce((sum, i) => sum + i.lineTotal, 0);

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
                            <button onClick={() => onRemove(idx)}>❌</button>
                        </td>
                    </tr>
                ))}
                <tr className="font-semibold bg-gray-50">
                    <td colSpan="3" className="text-right pr-4">សរុប:</td>
                    <td>{total}</td>
                    <td />
                </tr>
            </tbody>
        </table>
    );
}
