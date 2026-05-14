import { useState, useMemo, useCallback, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { formatUsdKhrLine } from "../../utils/formatAmount";
import saleApi from "../../api/saleApi";
import PageShell from "../../components/PageShell";

export default function SaleList() {
  /* ================= CONSTANTS ================= */
  const PAGE_SIZE = 15;
  const today = new Date().toISOString().slice(0, 10);

  /* ================= STATE ================= */
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /* ================= SALES QUERY ================= */
  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["sales", startDate, endDate, page],
    queryFn: async () => {
      const res = await saleApi.getSalesByDate({
        startDate,
        endDate,
        page,
        size: PAGE_SIZE,
      });

      return res.data;
    },
    keepPreviousData: true,
    refetchOnMount: "always",
  });

  /* ================= SUMMARY QUERY ================= */
  const {
    data: summary,
    isFetching: summaryFetching,
    isError: summaryError,
  } = useQuery({
    queryKey: ["sales-summary", startDate, endDate],
    queryFn: async () => {
      const res = await saleApi.getSalesByDateSummary({
        startDate,
        endDate,
      });

      return res.data;
    },
    staleTime: 30_000,
  });

  /* ================= RESET PAGE ================= */
  useEffect(() => {
    setPage(0);
  }, [startDate, endDate]);

  /* ================= PREFETCH NEXT PAGE ================= */
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["sales", startDate, endDate, page + 1],
      queryFn: async () => {
        const res = await saleApi.getSalesByDate({
          startDate,
          endDate,
          page: page + 1,
          size: PAGE_SIZE,
        });

        return res.data;
      },
    });
  }, [page, startDate, endDate, queryClient]);

  /* ================= DERIVED ================= */
  const sales = useMemo(() => data?.content ?? [], [data]);

  const totalPages = data?.totalPages ?? 0;

  const filteredSales = useMemo(() => {
    if (!search.trim()) return sales;

    const keyword = search.trim().toLowerCase();

    return sales.filter((s) => {
      return (
        String(s.id).includes(keyword) ||
        s.customer?.name?.toLowerCase().includes(keyword) ||
        s.customerName?.toLowerCase().includes(keyword)
      );
    });
  }, [sales, search]);

  /* ================= SUMMARY CALCULATION ================= */
  const totalSalesAll = Number(summary?.totalSales ?? 0);

  const totalPurchaseCostAll = Number(
    summary?.totalPurchaseCost ?? 0
  );

  // ចំណេញ = ការលក់សរុប - ថ្លៃដើមសរុប
  const profitAll = totalSalesAll - totalPurchaseCostAll;

  /* ================= DELETE ================= */
  const deleteMutation = useMutation({
    mutationFn: saleApi.removeSale,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sales"],
      });

      queryClient.invalidateQueries({
        queryKey: ["sales-summary"],
      });
    },
  });

  /* ================= HANDLERS ================= */
  const openSale = useCallback(
    (id) => {
      navigate(`/sales/SaleDetails/${id}`);
    },
    [navigate]
  );

  const deleteSale = useCallback(
    (id) => {
      const confirmed = window.confirm(
        "តើអ្នកពិតជាចង់លុបការលក់នេះមែនទេ?"
      );

      if (confirmed) {
        deleteMutation.mutate(id);
      }
    },
    [deleteMutation]
  );

  /* ================= LOADING ================= */
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FiLoader className="animate-spin mr-2" size={28} />
        កំពុងផ្ទុក...
      </div>
    );
  }

  /* ================= ERROR ================= */
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
      {/* Loading Overlay */}
      {isFetching && (
        <div className="absolute inset-0 bg-white/70 z-40 flex justify-center pt-24">
          <FiLoader className="animate-spin" size={22} />
        </div>
      )}

      {/* Date Filter */}
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
        {/* Search + Summary */}
        <div className="flex items-center gap-2">
          <input
            className="flex-1 border rounded-xl px-3 py-1 text-sm h-8"
            placeholder="ស្វែងរក..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="px-3 py-2 rounded-2xl bg-indigo-600 text-white font-bold text-xs max-w-[13rem] text-left leading-snug">
            <p className="font-bold">ការលក់ 
              {summaryError
                ? "មិនអាចគណនា"
                : summaryFetching
                ? "..."
                :`$${totalSalesAll.toFixed(2)}`}
            </p>

            <p className="mt-2 font-bold">ចំណេញ
              {summaryError
                ? "—"
                : summaryFetching
                ? "..."
                : `$${profitAll.toFixed(2)}`}
            </p> 
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
                {s.createdAt
                  ? new Date(s.createdAt).toLocaleString()
                  : "No Date"}
              </p>

              {s.items?.length > 0 ? (
                <ul className="text-xs text-gray-500 mt-1">
                  {s.items.map((item, idx) => (
                    <li key={idx}>
                      • {item.product?.name || "Unnamed Item"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs italic text-gray-400">
                  No items
                </p>
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
                <Trash2
                  size={18}
                  className="text-red-500"
                />
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
              className={`w-9 h-9 rounded-full border text-sm ${
                page === i
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-indigo-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Floating Add Button */}
      <button
        onClick={() => navigate("/sales/ProductSale")}
        className="fixed bottom-28 right-16 bg-indigo-600 text-white rounded-full p-3"
      >
        <Plus size={28} />
      </button>
    </PageShell>
  );
}