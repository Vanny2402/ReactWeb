import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";   // 👈 add Plus icon
import { useNavigate } from "react-router-dom"; // 👈 for navigation
import saleApi from "../../api/saleApi";
import { FiLoader } from "react-icons/fi";

export default function SaleList() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const res = await saleApi.getAllSales();
                const allSales = Array.isArray(res) ? res : res.data;

                const now = new Date();
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

                const filtered = allSales.filter((s) => {
                    const saleDate = new Date(s.createdAt);
                    return saleDate >= startOfMonth && saleDate <= endOfMonth;
                });

                setSales(filtered);
            } catch (err) {
                console.error("Error fetching sales:", err);
                setError("Failed to load sales");
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("តើអ្នកពិតជាចង់លុបការលក់នេះមែនទេ?");
        if (!confirmDelete) return;

        setDeletingId(id);
        try {
            await saleApi.removeSale(id);
            setSales((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            console.error("Error deleting sale:", err);
            setError("Failed to delete sale");
        } finally {
            setDeletingId(null);
        }
    };

    const totalAmount = sales.reduce((sum, s) => sum + Number(s.totalPrice || 0), 0);

    if (loading)
        return (
            <div className="space-y-3">
                <div className="flex justify-center py-10 text-gray-500">
                    <FiLoader className="animate-spin mr-2" />
                    កំពុងផ្ទុក...
                </div>
            </div>
        );

    if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;

    return (
        <div className="max-w-md mx-auto bg-white min-h-screen relative">
            {/* Floating loading spinner during delete */}
            {deletingId && (
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <div className="px-4 mt-6">
                <h2 className="font-semibold mb-3">ប្រតិបត្តិការលក់ខែនេះ</h2>
                {/* Balance Card */}
                <div className="px-4 mb-4">
                    <div className="w-full rounded-2xl p-2 text-white bg-gradient-to-r from-indigo-500 to-purple-300 shadow">
                        <p className="text-sm opacity-100">ការលក់សរុបខែនេះ</p>
                        <p className="text-1xl font-bold mt-2">${totalAmount.toFixed(2)}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {sales.map((s) => (
                        <div
                            key={s.id}
                            onClick={() => navigate(`/sales/SaleDetails/${s.id}`)}   // ✅ navigate to sale detail
                            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition"
                        >
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                                {s.customer?.name?.substring(0, 2).toUpperCase()}
                            </div>

                            {/* Transaction info */}
                            <div className="flex-1">
                                <p className="text-sm font-bold text-blue-600">
                                    {s.customer?.name} #{s.id}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {new Date(s.createdAt).toLocaleString()}
                                </p>
                            </div>

                            {/* Amount */}
                            <p className="text-sm font-semibold text-blue-600">
                                ${Number(s.totalPrice).toFixed(2)}
                            </p>

                            {/* Delete button (stop click propagation so row click doesn’t trigger) */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();   // ✅ prevent row click
                                    handleDelete(s.id);
                                }}
                                className="ml-2 p-1 rounded hover:bg-gray-100"
                                title="Delete sale"
                                disabled={!!deletingId}
                            >
                                <Trash2 size={18} className="text-red-500" />
                            </button>
                        </div>
                    ))}

                    {sales.length === 0 && (
                        <p className="text-center text-gray-500 text-sm">
                            No sales found for this month.
                        </p>
                    )}
                </div>

            </div>
            {/* Floating Add Sale Button */}
            <button
                onClick={() => navigate("/sales/ProductSale")}   // 👈 navigate to ProductSale form
                className="fixed bottom-20 right-6 bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition"
                title="Create new sale"
            >
                <Plus size={28} />
            </button>

        </div>
    );
}
