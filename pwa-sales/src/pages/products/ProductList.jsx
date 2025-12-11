import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { getAllProducts } from "../../api/productApi";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const nav = useNavigate();

  // ✅ Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await getAllProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      alert("មិនអាចទាញទិន្នន័យផលិតផលបានទេ!");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Navigate to edit page
  function handleEdit(id) {
    nav(`/products/edit/${id}`);
  }

  // ✅ Filter products by name
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 pb-24">
      {/* ✅ Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="ស្វែងរកតាមឈ្មោះផលិតផល..."
          className="w-full md:w-1/2 border px-4 py-2 rounded-xl shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ✅ Loading State */}
      {loading && <p className="text-gray-600 text-center">កំពុងផ្ទុក...</p>}

      {/* ✅ Product Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => handleEdit(p.id)}
              className="cursor-pointer bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition border"
            >
              {/* ✅ Product Name */}
              <h2 className="text-lg font-bold mb-2">{p.name}</h2>

              {/* ✅ Product Details */}
              <div className="text-sm text-gray-600 space-y-1">
                {/* Stock */}
                <p>
                  <span className="font-semibold">ស្តុក:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      p.stock > 10
                        ? "bg-green-600"
                        : p.stock > 0
                        ? "bg-yellow-500"
                        : "bg-red-600"
                    }`}
                  >
                    {p.stock}
                  </span>
                </p>
                {/* Type */}
                <p>
                  <span className="font-semibold">ប្រភេទ:</span> {p.productType}
                </p>
              </div>

              {/* ✅ Edit Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(p.id);
                }}
                className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                កែប្រែ
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Floating Add Button */}
      <Link
        to="/products/add"
        className="fixed bottom-20 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <FiPlus size={24} />
      </Link>
    </div>
  );
}
