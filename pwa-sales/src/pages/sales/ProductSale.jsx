import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSale } from "../../api/saleApi.js";
import { getAllProducts } from "../../api/productApi.js";
import { getAllCustomers } from "../../api/customerApi.js";
import { useParams } from "react-router-dom";

export default function ProductSale() {
    const { id } = useParams();   // <-- get product id from URL
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        productId: "",
        customerId: "",
        qty: "",
        price: "",
        remark: "",
        paidAmount: "",
        totalPrice: ""

    });
    
    // ✅ Fetch data once on mount
    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [productRes, customerRes] = await Promise.all([
                getAllProducts(),
                getAllCustomers(),
            ]);

            setProducts(productRes.data || []);
            setCustomers(customerRes.data || []);

            // ✅ Auto-select product if id is in URL
            if (id) {
                const selected = productRes.data.find((p) => p.id === Number(id));
                if (selected) {
                    setForm((prev) => ({
                        ...prev,
                        productId: selected.id,
                        price: selected.price,
                    }));
                }
            }
        } catch (err) {
            console.error("Error loading dropdown data", err);
            alert("មិនអាចទាញទិន្នន័យបានទេ!");
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "productId") {
            const selected = products.find((p) => p.id === Number(value));
            if (selected) {
                setForm((prev) => ({ ...prev, price: selected.price }));
            }
        }
    }

    async function handleSave() {
        if (!form.productId || !form.customerId || !form.qty) {
            alert("សូមបំពេញទិន្នន័យទាំងអស់!");
            return;
        }
        const saleData = {
            customer: { id: Number(form.customerId) },
            remark: form.remark,
            items: [
                {
                    product: { id: Number(form.productId) },
                    qty: Number(form.qty),
                    price: Number(form.price),
                },
            ],
            paidAmount: Number(form.paidAmount),   // ✅ include it
            totalPrice: Number(form.qty || 0) * Number(form.price || 0), // optional
            debt: Number(form.qty || 0) * Number(form.price || 0) - Number(form.paidAmount || 0) // optional
        };
        setSaving(true);
        try {
            await createSale(saleData);
            alert("ការលក់ត្រូវបានបង្កើតដោយជោគជ័យ!");
            navigate("/sales");
        } catch (err) {
            console.error(err);
            alert("Error creating sale");
            setSaving(false);
        }
    }

    // ✅ Show loading UI until data is ready
    if (products.length === 0 || customers.length === 0) {
        return <div className="p-4">កំពុងផ្ទុកទិន្នន័យ...</div>;
    }

    return (
        <div className="p-4 max-w-lg mx-auto">
            <div className="space-y-3">
                {/* Product Dropdown */}
                <div className="flex items-center gap-3">
                    <label className="w-32 text-sm font-medium">ផលិតផល</label>
                    <select
                        name="productId"
                        value={form.productId}
                        onChange={handleChange}
                        className="flex-1 border rounded px-3 py-2"
                    >
                        <option value="">-- ជ្រើសរើសផលិតផល --</option>
                        {products.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Customer Dropdown */}
                <div className="flex items-center gap-3">
                    <label className="w-32 text-sm font-medium">អតិថិជន</label>
                    <select
                        name="customerId"
                        value={form.customerId}
                        onChange={handleChange}
                        className="flex-1 border rounded px-3 py-2"
                    >
                        <option value="">-- ជ្រើសរើសអតិថិជន --</option>
                        {customers.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3">
                    <label className="w-32 text-sm font-medium">ចំនួន</label>
                    <input
                        name="qty"
                        value={form.qty}
                        onChange={handleChange}
                        className="flex-1 border rounded px-3 py-2"
                        type="number"
                        placeholder="ចំនួន"
                    />
                </div>

                {/* Price */}
                <div className="flex items-center gap-3">
                    <label className="w-32 text-sm font-medium">តម្លៃ</label>
                    <input
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        className="flex-1 border rounded px-3 py-2"
                        type="number"
                        placeholder="តម្លៃ"
                    />
                </div>

                {/* Total Price */}
                <div className="flex items-center gap-3">
                    <label className="w-32 text-sm font-medium">តម្លៃរុប</label>
                    <input
                        value={Number(form.qty || 0) * Number(form.price || 0)}
                        readOnly
                        className="flex-1 border rounded px-3 py-2 bg-gray-100"
                        type="number"
                        placeholder="តម្លៃរុប"
                    />
                </div>

                {/* Paid Amount */}
                <div className="flex items-center gap-3">
                    <label className="w-32 text-sm font-medium">ទឹកប្រាក់បង់</label>
                    <input
                        name="paidAmount"   // ✅ match state key
                        value={form.paidAmount}
                        onChange={handleChange}
                        className="flex-1 border rounded px-3 py-2"
                        type="number"
                        placeholder="ទឹកប្រាក់បង់"
                    />
                </div>

                {/* Debt On Sale */}
                <div className="flex items-center gap-3">
                    <label className="w-32 text-sm font-medium">ជំពាក់</label>
                    <input
                        value={
                            Number(form.qty || 0) * Number(form.price || 0) -
                            Number(form.paidAmount || 0)
                        }
                        readOnly
                        className="flex-1 border rounded px-3 py-2 bg-gray-100"
                        type="number"
                    />
                </div>

                {/* Remark */}
                <div className="flex items-center gap-3">
                    <label className="w-32 text-sm font-medium">ចំណាំ</label>
                    <input
                        name="remark"
                        value={form.remark}
                        onChange={handleChange}
                        className="flex-1 border rounded px-3 py-2"
                        placeholder="ចំណាំ"
                    />
                </div>
            </div>
            {/* Buttons */}
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
                    className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                    {saving ? "កំពុងរក្សាទុក..." : "រក្សាទុក"}
                </button>
            </div>
        </div>
    );
}