import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { FiLoader } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import StarIcon from "@mui/icons-material/Star";
import saleApi from "../../api/saleApi";
import { getAllProducts } from "../../api/productApi";
import { getAllCustomers } from "../../api/customerApi";

export default function ProductSale() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  /* ================= URL PARAMS ================= */
  const params = new URLSearchParams(location.search);
  const defaultProductId = params.get("productId") || "";
  const defaultCustomerId = params.get("customerId") || "";

  /* ================= STATE ================= */
  const [cartItems, setCartItems] = useState([]);
  const [customerLocked, setCustomerLocked] = useState(false);

  const [form, setForm] = useState({
    productId: defaultProductId,
    customerId: defaultCustomerId,
    qty: "",
    price: "",
    paidAmount: "",
    remark: "",
  });

  /* ================= QUERIES ================= */
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const { data: customers = [], isLoading: loadingCustomers } = useQuery({
    queryKey: ["customers"],
    queryFn: getAllCustomers,
  });

  const loading = loadingProducts || loadingCustomers;

  /* ================= SORT PRODUCTS ================= */
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  /* ================= AUTO-FILL PRODUCT ================= */
  useEffect(() => {
    if (!defaultProductId || products.length === 0) return;

    const product = products.find(p => p.id === Number(defaultProductId));
    if (product && form.price !== product.price) {
      requestAnimationFrame(() => {
        setForm(prev => ({
          ...prev,
          productId: defaultProductId,
          price: product.price,
        }));
      });
    }
  }, [defaultProductId, products]);

  /* ================= SELECTED CUSTOMER ================= */
  const selectedCustomer = customers.find(
    c => c.id === Number(form.customerId)
  );
  const totalDebt = selectedCustomer?.totalDebt || 0;

  /* ================= FORM HANDLERS ================= */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleProductChange = useCallback(
    (value) => {
      const product = products.find(p => p.id === Number(value));
      setForm(prev => ({
        ...prev,
        productId: value,
        price: product ? product.price : "",
      }));
    },
    [products]
  );

  /* ================= CART ================= */
  const handleAddToCart = () => {

    if (!form.customerId) return alert("សូមជ្រើសរើសអតិថិជន");
    if (!form.productId || !form.qty || !form.price)
      return alert("សូមបញ្ចូល ផលិតផល ចំនួន និង តម្លៃ!");

    if (!/^\d+$/.test(form.qty)) {
      return alert("ចំនួន ត្រូវតែជាលេខប៉ុណ្ណោះ");
  }    
    const product = products.find(p => p.id === Number(form.productId));
    if (!product) return;

    const qty = Number(form.qty);
    if (product.stock === 0)
      return alert(`ផលិតផល "${product.name}" អស់ពីស្តុកហើយ!`);
    if (qty > product.stock)
      return alert(`ចំនួនស្តុកមានត្រឹមតែ ${product.stock}`);

    setCartItems(prev => [
      ...prev,
      {
        product: { id: product.id, name: product.name },
        qty,
        price: Number(form.price),
        lineTotal: qty * Number(form.price),
      },
    ]);

    setCustomerLocked(true);
    setForm(prev => ({ ...prev, qty: "" }));
  };

  const handleRemove = (index) => {
    setCartItems(prev => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) setCustomerLocked(false);
      return next;
    });
  };

  /* ================= TOTALS ================= */
  const total = useMemo(
    () => cartItems.reduce((s, i) => s + i.lineTotal, 0),
    [cartItems]
  );

  const paid = Number(form.paidAmount || 0);
  const debt = total - paid;

  /* ================= SAVE ================= */
  const saveMutation = useMutation({
    mutationFn: saleApi.createSale,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["sales", "current-month"],
      });
      navigate("/sales/list", { replace: true });
    },
    onError: () => alert("បរាជ័យ"),
  });

  const handleSave = () => {
    if (cartItems.length === 0)
      return alert("សូមបន្ថែមយ៉ាងហោចណាស់ ១ ផលិតផលទៅកន្ត្រក");
    if (!form.customerId) return alert("សូមជ្រើសរើសអតិថិជន");
    if (paid < 0) return alert("ទឹកប្រាក់បង់ មិនត្រឹមត្រូវ");
    if (paid > totalDebt + total)
      return alert("ទឹកប្រាក់បង់លើសពីបំណុល");

    saveMutation.mutate({
      customer: { id: Number(form.customerId) },
      paidAmount: paid,
      remark: form.remark,
      items: cartItems.map(i => ({
        product: { id: i.product.id },
        qty: i.qty,
        price: i.price,
      })),
    });
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="flex justify-center py-10 text-gray-500">
        <FiLoader className="animate-spin mr-2" />
        កំពុងផ្ទុក...
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">

      <SearchCustomer
        label={<>អតិថិជន <StarIcon style={{ color: "red", fontSize: "0.7rem" }} /></>}
        options={customers}
        value={form.customerId}
        disabled={customerLocked}
        onChange={(value) =>
          setForm(prev => ({ ...prev, customerId: value }))
        }
      />

      <SearchProduct
        label={<>ផលិតផល <StarIcon style={{ color: "red", fontSize: "0.7rem" }} /></>}
        options={sortedProducts}
        value={form.productId}
        onChange={handleProductChange}
      />

      <InputRow label="ចំនួន" name="qty" value={form.qty} onChange={handleChange} />
      <InputRow label="តម្លៃ $" name="price" value={form.price} onChange={handleChange} />

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

      <InputRow label="ទឹកប្រាក់បង់ $" name="paidAmount" value={form.paidAmount} onChange={handleChange} />
      <InputRow label="ចំណាំ" name="remark" value={form.remark} onChange={handleChange} />

      <button
        onClick={handleSave}
        disabled={saveMutation.isPending}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        {saveMutation.isPending ? "កំពុងរក្សាទុក..." : "យល់ព្រម"}
      </button>
    </div>
  );
}

/* ================= SEARCH CUSTOMER ================= */
function SearchCustomer({ label, options, value, onChange, disabled }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const selected = options.find(o => o.id === Number(value));
    if (selected) setSearch(selected.name);
  }, [value, options]);

  const filtered = options.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SearchDropdown
      label={label}
      search={search}
      setSearch={setSearch}
      open={open}
      setOpen={setOpen}
      disabled={disabled}
      options={filtered}
      onSelect={(o) => onChange(o.id)}
    />
  );
}

/* ================= SEARCH PRODUCT ================= */
function SearchProduct({ label, options, value, onChange }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const selected = options.find(o => o.id === Number(value));
    if (selected) setSearch(selected.name);
  }, [value, options]);

  const filtered = options.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SearchDropdown
      label={label}
      search={search}
      setSearch={setSearch}
      open={open}
      setOpen={setOpen}
      options={filtered}
      renderItem={(o) => `${o.name} (${o.stock})`}
      onSelect={(o) => onChange(o.id)}
    />
  );
}

/* ================= GENERIC SEARCH DROPDOWN ================= */
function SearchDropdown({
  label,
  search,
  setSearch,
  open,
  setOpen,
  options,
  onSelect,
  renderItem,
  disabled,
}) {
  return (
    <div className="flex gap-3 relative">
      <label className="w-32">{label}</label>
      <div className="flex-1 relative">
        <input
          value={search}
          disabled={disabled}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full border rounded px-3 py-2"
          placeholder="ស្វែងរក..."
        />
        {open && search && (
          <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-y-auto shadow">
            {options.length > 0 ? (
              options.map(o => (
                <li
                  key={o.id}
                  onClick={() => {
                    onSelect(o);
                    setSearch(o.name);
                    setOpen(false);
                  }}
                  className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                >
                  {renderItem ? renderItem(o) : o.name}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-400">មិនមានទិន្នន័យ</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ================= REUSABLE ================= */
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
              <button onClick={() => onRemove(idx)} className="text-red-600">
                ❌
              </button>
            </td>
          </tr>
        ))}
        <tr className="bg-gray-50 font-semibold">
          <td colSpan="3" className="text-right pr-4">សរុប:</td>
          <td className="text-right pr-4 text-red-600">{total}</td>
          <td />
        </tr>
        <tr className="bg-gray-50">
          <td colSpan="3" className="text-right pr-4">ជំពាក់:</td>
          <td className="text-right pr-4 text-red-600">{debt}</td>
          <td />
        </tr>
      </tbody>
    </table>
  );
}