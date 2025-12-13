import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createSale } from "../../api/saleApi.js";
import { getAllProducts } from "../../api/productApi.js";
import { getAllCustomers } from "../../api/customerApi.js";
import moment from "moment-timezone";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";


export default function ProductSale() {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const [customerLocked, setCustomerLocked] = useState(false);


    // form for current item
    const [form, setForm] = useState({
        productId: "",
        customerId: "",
        qty: "",
        price: "",
        remark: "",
        paidAmount: ""
    });

    // cart items
    const [cartItems, setCartItems] = useState([]);

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
        setForm((prev) => ({ ...prev, [name]: value }));

        if (name === "productId") {
            const selected = products.find((p) => p.id === Number(value));
            if (selected) {
                setForm((prev) => ({ ...prev, price: selected.price }));
            }
        }
    }

    // function handleAddToCart() {
    //     if (!form.productId || !form.qty || !form.price) {
    //         alert("សូមបំពេញទិន្នន័យផលិតផល!");
    //         return;
    //     }

    //     const product = products.find((p) => p.id === Number(form.productId));
    //     const lineTotal = Number(form.qty) * Number(form.price);

    //     setCartItems((prev) => [
    //         ...prev,
    //         {
    //             product: { id: Number(form.productId), name: product?.name },
    //             qty: Number(form.qty),
    //             price: Number(form.price),
    //             lineTotal,
    //         },
    //     ]);

    //     // ✅ lock customer once first item is added
    //     setCustomerLocked(true);

    //     // reset qty for next add
    //     setForm((prev) => ({ ...prev, qty: "", price: product?.price || "" }));
    // }
    // }

    function handleAddToCart() {
        // Check if customer selected
        if (!form.customerId) {
            alert("សូមជ្រើសរើសអតិថិជនជាមុន!");
            return;
        }

        // Check product fields
        if (!form.productId || !form.qty || !form.price) {
            alert("សូមបំពេញទិន្នន័យផលិតផល!");
            return;
        }

        const product = products.find((p) => p.id === Number(form.productId));
        const lineTotal = Number(form.qty) * Number(form.price);

        setCartItems((prev) => [
            ...prev,
            {
                product: { id: Number(form.productId), name: product?.name },
                qty: Number(form.qty),
                price: Number(form.price),
                lineTotal,
            },
        ]);

        // Lock customer after the first item added
        setCustomerLocked(true);

        // Reset qty for next item
        setForm((prev) => ({ ...prev, qty: "", price: product?.price || "" }));
    }

    function handleRemoveFromCart(index) {
        setCartItems((prev) => prev.filter((_, i) => i !== index));

        // unlock customer if cart becomes empty
        if (cartItems.length === 1) {
            setCustomerLocked(false);
        }
    }


    async function handleSave() {
        if (!form.customerId || cartItems.length === 0) {
            alert("សូមជ្រើសរើសអតិថិជន និងបន្ថែមផលិតផល!");
            return;
        }

        const totalPrice = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
        const paidAmount = Number(form.paidAmount || 0);
        const debt = totalPrice - paidAmount;

        const saleData = {
            customer: { id: Number(form.customerId) },
            remark: form.remark,
            items: cartItems.map((item) => ({
                product: { id: item.product.id },
                qty: item.qty,
                price: item.price,
            })),
            paidAmount,
            totalPrice,
            debt,
            saleTime: moment().tz("Asia/Phnom_Penh").format(),
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

    if (products.length === 0 || customers.length === 0) {
        return <div className="p-4">កំពុងផ្ទុកទិន្នន័យ...</div>;
    }

    return (
        <div className="p-4 max-w-lg mx-auto">
            <div className="space-y-3">
                {/* Customer Dropdown */}
                <div className="flex items-center gap-3">
                    <label className="w-32 text-sm font-medium">អតិថិជន</label>
                    <select
                        name="customerId"
                        value={form.customerId}
                        onChange={handleChange}
                        disabled={customerLocked}   // ✅ prevent changing once locked
                        className="flex-1 border rounded px-3 py-2"
                    >
                        <option value="">ជ្រើសរើសអតិថិជន</option>
                        {customers.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

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

                {/* Add to Cart Button */}
                <div className="mt-2 flex justify-end">
                    <button
                        onClick={handleAddToCart}
                        className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                        <ShoppingCartIcon className="h-5 w-5" />
                        បន្ថែមទៅកន្ត្រក
                    </button>
                </div>

                {/* Cart Table */}
                {cartItems.length > 0 && (
                    <table className="mt-4 w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-2 py-1">ផលិតផល</th>
                                <th className="border px-2 py-1">ចំនួន</th>
                                <th className="border px-2 py-1">តម្លៃ</th>
                                <th className="border px-2 py-1">តម្លៃរុប</th>
                                <th className="border px-2 py-1"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {cartItems.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="border px-2 py-1">{item.product.name}</td>
                                    <td className="border px-2 py-1">{item.qty}</td>
                                    <td className="border px-2 py-1">{item.price}</td>
                                    <td className="border px-2 py-1">{item.lineTotal}</td>
                                    <td className="border px-2 py-1 text-center">
                                        <button
                                            onClick={() => handleRemoveFromCart(idx)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            ❌
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            <tr className="bg-gray-50 font-semibold">
                                <td colSpan="3" className="text-right pr-4">សរុប:</td>
                                <td className="border px-4 py-3">
                                    {new Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                        maximumFractionDigits: 0,
                                    }).format(
                                        cartItems.reduce((sum, i) => sum + i.lineTotal, 0)
                                    )}
                                </td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                )}

                {/* Paid Amount */}
                <div className="flex items-center gap-3 mt-3">
                    {/* <label className="w-32 text-sm font-medium">ទឹកប្រាក់បង់</label> */}
                    <input
                        name="paidAmount"
                        value={form.paidAmount}
                        onChange={handleChange}
                        className="flex-1 border rounded px-3 py-2"
                        type="number"
                        placeholder="ទឹកប្រាក់បង់"
                    />
                </div>

                {/* Remark */}
                <div className="flex items-center gap-3 mt-3">
                    {/* <label className="w-32 text-sm font-medium">ចំណាំ</label> */}
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
