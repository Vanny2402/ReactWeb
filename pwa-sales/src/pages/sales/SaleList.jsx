import { useMemo, useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import { FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import saleApi from "../../api/saleApi";
import PageShell from "../../components/PageShell";

export default function SaleList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  /* ================= FETCH SALES ================= */
  const {
    data: sales = [],
    isLoading,
    isError,
    isFetching,   // 👈 ADD THIS
  } = useQuery({
    queryKey: ["sales", "current-month"],
    queryFn: async () => {
      const res = await saleApi.gesSaleCurrentMonthDto();
      return res.data ?? res;
    },
    staleTime: 0,
    refetchOnMount: "always",
  });


  /* ================= DELETE SALE ================= */
  const deleteMutation = useMutation({
    mutationFn: (id) => saleApi.removeSale(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: ["sales", "current-month"],
      });

      const previous = queryClient.getQueryData([
        "sales",
        "current-month",
      ]);

      queryClient.setQueryData(
        ["sales", "current-month"],
        (old = []) => old.filter((s) => s.id !== id)
      );

      return { previous };
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["sales", "current-month"],
          context.previous
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["sales", "current-month"],
      });
    },
  });

  /* ================= DERIVED DATA ================= */
  const totalAmount = useMemo(
    () =>
      sales.reduce(
        (sum, s) => sum + Number(s.totalPrice || 0),
        0
      ),
    [sales]
  );

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

  /* ================= STATES ================= */
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <FiLoader className="animate-spin mr-2" size={30} />
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
  console.log("SaleList rendered", sales.length);

  /* ================= UI ================= */
  return (
    <PageShell>
      {/* 🔄 Delete overlay */}
      {isFetching && (
        <div className="absolute inset-0 bg-white/80 z-40 mt-3">
          <div className="flex justify-center pt-20">
            <FiLoader className="animate-spin text-gray-600" size={22} />
            កំពុងផ្ទុក...
          </div>
        </div>
      )}

      {deleteMutation.isPending && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4">
        {/* <button className="p-2 rounded hover:bg-gray-100">☰</button> */}
        <h1 className="text-lg font-bold">ប្រតិបត្តិការលក់</h1>
        {/* <button className="p-2 rounded hover:bg-gray-100">✕</button> */}
      </div>

      {/* Total card */}
      <div className="px-2 mt-1">
        <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-400 p-4 text-white shadow">
          <p className="text-sm opacity-90">ការលក់សរុបខែនេះ</p>
          <p className="text-1xl font-bold">
            ${totalAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Sale list */}
      <div className="px-4 mt-4 space-y-3 pb-28">
        {sales.map((s) => (
          <div
            key={s.id}
            onClick={() => openSale(s.id)}
            className="bg-white rounded-xl border p-3 flex items-center gap-3 hover:bg-gray-50 transition cursor-pointer"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
              {s.customerName?.substring(0, 2).toUpperCase()}
            </div>
            {/* Info */}

            <div className="flex-1">
              <p className="font-semibold text-sm">
                {s.customerName} #{s.id}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(s.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Amount */}
            <p className="font-semibold text-indigo-600">
              ${Number(s.totalPrice).toFixed(2)}
            </p>

            {/* Delete */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteSale(s.id);
              }}
              className="p-2 rounded hover:bg-gray-100"
            >
              <Trash2 size={18} className="text-red-500" />
            </button>
          </div>
        ))}


        {sales.length === 0 && (
          <p className="text-center text-gray-500 text-sm">
            មិនមានទិន្នន័យក្នុងខែនេះទេ
          </p>
        )}
      </div>

      {/* Floating add */}
      <button
        onClick={() => navigate("/sales/ProductSale")}
        className="fixed bottom-20 right-6 bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700"
      >
        <Plus size={28} />
      </button>
    </PageShell>
  );
}
