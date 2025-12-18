import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiPlus, FiEdit, FiLoader } from "react-icons/fi"; // ✅ added FiLoader
import { getAllProducts } from "../../api/productApi.js";

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
      setProducts(res); // <-- FIXED
    } catch (err) {
      console.error(err);
      alert("មិនអាចទាញទិន្នន័យផលិតផលបានទេ!");
    } finally {
      setLoading(false);
    }
  }


  function handlePurchas(id) {
    nav(`/products/edit/${id}?mode=1`);
  }

  function handleSale(id) {
    nav(`/sales/ProductSale?productId=${id}`);

  }

  const filteredProducts = products.filter((p) =>
    (p.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 pb-24">
      {/* ✅ Search Bar + Stock In/Out */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="ស្វែងរកតាមឈ្មោះផលិតផល..."
          className="w-full md:w-1/2 border px-4 py-2 rounded-xl shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* ✅ Stock In / Stock Out */}
        <div className="flex gap-6 text-sm font-semibold text-gray-700">
          <span>
            តម្លៃចូលសរុប:{" "}
            <span className="text-green-600">
              {products.reduce(
                (acc, p) => acc + (p.purchasePrice || 0) * (p.stock || 0),
                0
              ).toLocaleString()}
            </span>
          </span>
          <span>
            តម្លៃលក់ចេញសរុប:{" "}
            <span className="text-red-600">
              {products.reduce(
                (acc, p) => acc + (p.price || 0) * (p.stock || 0),
                0
              ).toLocaleString()}
            </span>
          </span>
        </div>
      </div>

      {/* ✅ Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-10 text-gray-600">
          <FiLoader className="animate-spin mr-2" size={22} />
          កំពុងផ្ទុក...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              Purchase={handlePurchas}
              Sale={handleSale}
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

function ProductCard({ product, Purchase, Sale }) {
  // Format price with currency
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD", // change to "KHR" if you want Riel
      minimumFractionDigits: 2,
    }).format(price);

  return (
    <div className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition border relative">
      {/* Edit Icon */}
      <button
        onClick={() => Purchase(product.id)}
        className="absolute top-3 right-3 text-blue-600 hover:text-blue-800"
      >
        <FiEdit size={20} />
      </button>

      {/* Product Name */}
      <h2 className="text-lg font-bold mb-2">{product.name}</h2>

      {/* Product Details */}
      <div className="text-sm text-gray-600 space-y-1">
        <p className="flex items-center justify-between">
          <span className="font-semibold">ចំនួនស្តុក:</span>
          <span
            className={`px-1 py-1 rounded text-white ${
              product.stock > 10
                ? "bg-green-600"
                : product.stock > 0
                ? "bg-yellow-500"
                : "bg-red-600"
            }`}
          >
          {product.stock}
          </span>
          <span className="ml-40 font-semibold">
            {formatPrice(product.price)}
          </span>
        </p>
        <p>
          <span className="font-semibold">ប្រភេទ:</span> {product.productType}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => Sale(product.id)}
          className="flex-1 bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
        >
          លក់
        </button>
      </div>
    </div>
  );
}
