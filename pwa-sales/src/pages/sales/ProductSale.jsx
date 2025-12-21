import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { FiLoader } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import StarIcon from '@mui/icons-material/Star';
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

  /* ================= SortProudct On Dropdown ================= */
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);


  const { data: customers = [], isLoading: loadingCustomers } = useQuery({
    queryKey: ["customers"],
    queryFn: getAllCustomers,
  });

  const loading = loadingProducts || loadingCustomers;

  /* ================= AUTO-FILL DEFAULT PRODUCT ================= */
  useEffect(() => {
    if (!defaultProductId || products.length === 0) return;

    const product = products.find(p => p.id === Number(defaultProductId));
    if (product && form.price !== product.price) {
      // defer to avoid React warning
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
    (e) => {
      const value = e.target.value;
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

  /* ================= SAVE SALE ================= */
  const saveMutation = useMutation({
    mutationFn: saleApi.createSale,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["sales", "current-month"],
        refetchType: "active",
      });
      navigate("/sales/list", { replace: true });
    },
    onError: (err) => {
      console.error(err);
      alert("បរាជ័យ");
    },
  });

  const handleSave = () => {
    if (cartItems.length === 0)
      return alert("សូមបន្ថែមយ៉ាងហោចណាស់ ១ ផលិតផលទៅកន្ត្រក");
    if (!form.customerId) return alert("សូមជ្រើសរើសអតិថិជន");
    if (Number(form.paidAmount || 0) < 0) return alert("ទឹកប្រាក់បង់ មិនត្រឹមត្រូវ");
    if (Number(form.paidAmount || 0) > totalDebt + total)
      return alert("ទឹកប្រាក់បង់លើសពីបំណុល");

    saveMutation.mutate({
      customer: { id: Number(form.customerId) },
      paidAmount: Number(form.paidAmount || 0),
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
      <CustSelect
        label={<>អតិថិជន <StarIcon style={{ color: "red", fontSize: "0.7rem" }} /> </>}
        name="customerId"
        value={form.customerId}
        onChange={handleChange}
        disabled={customerLocked}
        options={customers}
      />
      <SelectRow
        label={<>ផលិតផល <StarIcon style={{ color: "red", fontSize: "0.7rem" }} /> </>}
        name="productId"
        value={form.productId}
        onChange={handleProductChange}
        options={sortedProducts}
      // options={products}
      />
      <InputRow
        label={<>ចំនួន <StarIcon style={{ color: "red", fontSize: "0.7rem" }} /> </>}
        name="qty"
        value={form.qty}
        onChange={handleChange}
        placeholder="1,2,3.."
        required
      />
      <InputRow label={<>តម្លៃ $ <StarIcon style={{ color: "red", fontSize: "0.7rem" }} /> </>} name="price" value={form.price} onChange={handleChange} placeholder="$  " />
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

      <InputRow label="ទឹកប្រាក់បង់ $" name="paidAmount" value={form.paidAmount} onChange={handleChange} placeholder="$  " />
      <InputRow label="ចំណាំ" name="remark" value={form.remark} onChange={handleChange} placeholder="ចំណាំ..  " />

      <button
        onClick={handleSave}
        disabled={saveMutation.isPending}
        className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
      >
        {saveMutation.isPending ? "កំពុងរក្សាទុក..." : "យល់ព្រម​"}
      </button>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */
function CustSelect({ label, options = [], ...props }) {
  return (
    <div className="flex gap-3">
      <label className="w-32">{label}</label>
      <select {...props} className="flex-1 border rounded px-3 py-2">
        <option value="">ជ្រើសរើស</option>
        {options.map(o => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function SelectRow({ label, options = [], ...props }) {
  return (
    <div className="flex gap-3">
      <label className="w-32">{label}</label>
      <select {...props} className="flex-1 border rounded px-3 py-2">
        <option value="">ជ្រើសរើស</option>
        {options.map(o => (
          <option key={o.id} value={o.id} style={{ color: o.stock === 0 ? "red" : "black" }}>
            {o.name} ({o.stock})
          </option>
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
              <button onClick={() => onRemove(idx)} className="text-red-600 hover:underline">
                ❌
              </button>
            </td>
          </tr>
        ))}

        <tr className="font-semibold bg-gray-50">
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