import { useState, useMemo, useCallback, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format2Digit } from "../../utils/formatAmount";
import saleApi from "../../api/saleApi";
import PageShell from "../../components/PageShell";

export default function SaleList() {
  /* ================= CONSTANTS ================= */
  const PAGE_SIZE = 15;
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  /* ================= STATE ================= */
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /* ================= FETCH ================= */
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["sales", startDate, endDate, page],
    queryFn: () =>
      saleApi
        .getSalesByDate({
          startDate,
          endDate,
          page,
          size: PAGE_SIZE,
        })
        .then((res) => res.data),
    keepPreviousData: true,
    refetchOnMount: "always",
  });

  /* ================= DERIVED ================= */
  const sales = useMemo(() => data?.content ?? [], [data]);
  const totalPages = data?.totalPages ?? 0;

  // Filter search by Sale ID or Customer Name
  const filteredSales = useMemo(() => {
    if (!search.trim()) return sales;

    const keyword = search.trim().toLowerCase();

    return sales.filter((s) => {
      if (String(s.id).includes(keyword)) return true;
      if (s.customerName?.toLowerCase().includes(keyword)) return true;
      return false;
    });
  }, [sales, search]);

  const totalAmount = useMemo(
    () => filteredSales.reduce((sum, s) => sum + Number(s.totalPrice || 0), 0),
    [filteredSales]
  );

const totalPurchasePrice = useMemo(() => {
  return filteredSales.reduce((saleSum, sale) => {
    const salePurchaseTotal = sale.items?.reduce((itemSum, item) => {
      const purchasePrice = Number(item.product?.purchasePrice || 0);
      const qty = Number(item.qty || 0);
      return itemSum + purchasePrice * qty;
    }, 0);

    return saleSum + salePurchaseTotal;
  }, 0);
}, [filteredSales]);
  /* ================= PREFETCH NEXT PAGE ================= */
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["sales", startDate, endDate, page + 1],
      queryFn: () =>
        saleApi
          .getSalesByDate({
            startDate,
            endDate,
            page: page + 1,
            size: PAGE_SIZE,
          })
          .then((res) => res.data),
    });
  }, [page, startDate, endDate, queryClient]);

  /* ================= MUTATIONS ================= */
  const deleteMutation = useMutation({
    mutationFn: saleApi.removeSale,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sales"] }),
  });

  /* ================= HANDLERS ================= */
  const openSale = useCallback(
    (id) => navigate(`/sales/SaleDetails/${id}`),
    [navigate]
  );

  const deleteSale = useCallback(
    (id) => {
      if (window.confirm("តើអ្នកពិតជាចង់លុបការលក់នេះមែនទេ?")) {
        deleteMutation.mutate(id);
      }
    },
    [deleteMutation]
  );

  /* ================= LOADING / ERROR STATES ================= */
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FiLoader className="animate-spin mr-2" size={28} />
        កំពុងផ្ទុក...
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 mt-10">
        មានបញ្ហាក្នុងការទាញទិន្នន័យ!
      </p>
    );
  }

  /* ================= UI ================= */
  return (
    <PageShell>
      {/* Fetch overlay */}
      {isFetching && (
        <div className="absolute inset-0 bg-white/70 z-40 flex justify-center pt-24">
          <FiLoader className="animate-spin" size={22} />
        </div>
      )}

      {/* Header + Date Filter */}
      <div className="px-4 pt-4 border-b flex items-center gap-3">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded-lg px-1 text-sm"
        />
        <span className="text-sm">→</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded-lg px-1 text-sm"
        />
      </div>

      <div className="px-4 mt-2 space-y-2">
        {/* Search + Total */}
        <div className="flex items-center gap-2">
          <input
            className="flex-1 border rounded-xl px-3 py-1 text-sm h-8"
            placeholder="ស្វែងរក..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="px-5 py-1 rounded-2xl bg-indigo-600 text-white font-bold text-sm whitespace-nowrap">
            <p>សរុបការលក់  : {format2Digit(totalAmount)} $</p>
            <p>ចំណេញសរុប  : {format2Digit(totalAmount-totalPurchasePrice)} $</p>
          </div>
        </div>

        {/* Sale List */}
        {filteredSales.map((s) => (
          <div
            key={s.id}
            onClick={() => openSale(s.id)}
            className="bg-white rounded-2xl border p-4 flex justify-between cursor-pointer"
          >
            <div>
              <p className="font-semibold text-sm">
                #{s.id} / {s.customer?.name}
              </p>
              <p className="text-xs text-gray-400">
                {s.createdAt ? new Date(s.createdAt).toLocaleString() : "No Date"}
              </p>

              {s.items?.length > 0 ? (
                <ul className="text-xs text-gray-500 mt-1">
                  {s.items.map((item, idx) => (
                    <li key={idx}>• {item.product?.name || "Unnamed Item"}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs italic text-gray-400">No items</p>
              )}
            </div>

            <div className="text-right">
              <p className="font-bold text-indigo-600">
                ${Number(s.totalPrice || 0).toFixed(2)}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSale(s.id);
                }}
                className="mt-2 p-2 rounded-full hover:bg-red-50"
              >
                <Trash2 size={18} className="text-red-500" />
              </button>
            </div>
          </div>
        ))}

      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="fixed bottom-14 left-0 right-0 bg-white border-t py-3 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-9 h-9 rounded-full border text-sm ${page === i
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-indigo-50"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Floating Add */}
      <button
        onClick={() => navigate("/sales/ProductSale")}
       className="fixed bottom-28 right-16 bg-indigo-600 text-white rounded-full p-3">
        <Plus size={28} />
      </button>
    </PageShell>
  );
}
