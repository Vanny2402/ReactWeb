import { useEffect, useState } from "react";
import { Sale, DayGroup } from "../types";
import { groupByDay } from "../formatters";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export function useSaleReport(start: Date, end: Date) {
  const [data, setData] = useState<DayGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      setError(null);

      try {
        const qs = new URLSearchParams({
          start: start.toISOString().slice(0, 10),
          end: end.toISOString().slice(0, 10),
          page: "0",
          size: "50",
        });

        const response = await fetch(`${API_BASE}/api/sales?${qs}`);
        if (!response.ok) throw new Error("Failed to fetch sales data");

        const raw: any[] = await response.json();

        const sales: Sale[] = raw.map((s) => ({
          orderNo: String(s.id),
          dateTime: s.createdAt,
          paymentMethod: s.payment?.method ?? "ABA",
          totalAmount: s.totalPrice,
          note: s.remark ?? undefined,
          items: s.items.map((it: any) => ({
            name: it.product.name,
            unitPrice: it.price,
            qty: it.qty,
          })),
          customerName: s.customer?.name ?? "Guest", // <-- map from backend
        }));

        setData(groupByDay(sales));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [start, end]);

  return { data, loading, error };
}