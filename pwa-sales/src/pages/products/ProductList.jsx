import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiPlus, FiEdit } from "react-icons/fi";
import { getAllProducts } from "../../api/productApi";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const nav = useNavigate();

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

  // Separate handlers for Modify1 and Modify2
  function handleModify1(id) {
    nav(`/products/edit/${id}?mode=1`);
  }

  function handleModify2(id) {
    nav(`/products/edit/${id}?mode=2`);
  }

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
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-600">កំពុងផ្ទុក...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onModify1={handleModify1}
              onModify2={handleModify2}
            />
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

/* 🔹 Extracted ProductCard for clarity */
function ProductCard({ product, onModify1, onModify2 }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition border relative">
      {/* Edit Icon */}
      <button
        onClick={() => onModify1(product.id)}
        className="absolute top-3 right-3 text-blue-600 hover:text-blue-800"
      >
        <FiEdit size={20} />
      </button>

      {/* Product Name */}
      <h2 className="text-lg font-bold mb-2">{product.name}</h2>

      {/* Product Details */}
      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <span className="font-semibold">ចំនួនស្តុក:</span>{" "}
          <span
            className={`px-2 py-1 rounded text-white ${
              product.stock > 10
                ? "bg-green-600"
                : product.stock > 0
                ? "bg-yellow-500"
                : "bg-red-600"
            }`}
          >
            {product.stock}
          </span>
        </p>
        <p>
          <span className="font-semibold">ប្រភេទ:</span> {product.productType}
        </p>
      </div>

      {/* ✅ Split Modify Buttons */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onModify1(product.id)}
          className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Modify1
        </button>
        <button
          onClick={() => onModify2(product.id)}
          className="flex-1 bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
        >
          Modify2
        </button>
      </div>
    </div>
  );
}
