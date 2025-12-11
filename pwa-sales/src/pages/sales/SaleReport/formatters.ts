// Pages/sales/SaleReport/utils/formatters.ts
import { Sale, DayGroup } from "./types";

/**
 * Format a number as currency (USD by default).
 * You can swap 'USD' with your local currency code if needed.
 */
export const fmtCurrency = (n: number) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);

/**
 * Format an ISO date string into a human-readable time (e.g., "9:44 AM").
 */
export const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

/**
 * Group sales by calendar day, summing totals and quantities.
 */
export function groupByDay(sales: Sale[]): DayGroup[] {
  const byDay = new Map<string, DayGroup>();

  for (const s of sales) {
    const d = new Date(s.dateTime);
    const dateLabel = d.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });

    const qtySum = s.items.reduce((acc, it) => acc + it.qty, 0);

    if (!byDay.has(dateLabel)) {
      byDay.set(dateLabel, { dateLabel, totalAmount: 0, totalQty: 0, sales: [] });
    }

    const g = byDay.get(dateLabel)!;
    g.sales.push(s);
    g.totalAmount += s.totalAmount;
    g.totalQty += qtySum;
  }

  // Sort groups by date descending
  return Array.from(byDay.values()).sort(
    (a, b) => new Date(b.dateLabel).getTime() - new Date(a.dateLabel).getTime()
  );
}
