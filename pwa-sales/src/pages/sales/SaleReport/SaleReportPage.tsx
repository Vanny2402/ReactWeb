// Pages/sales/SaleReport/SaleReportPage.tsx
import React, { useState } from "react";
import { useSaleReport } from "./hooks/useSaleReport";
import { DayGroup } from "./types";
import DayGroupCard from "./DayGroupCard";
import styles from "./saleReport.module.css";

export default function SaleReportPage() {
  // Default range: last 7 days
  const today = new Date();
  const [range, setRange] = useState(() => {
    const end = today;
    const start = new Date(today);
    start.setDate(today.getDate() - 7);
    return { start, end };
  });

  const { data, loading, error } = useSaleReport(range.start, range.end);

  return (
    <div className={styles.reportPage}>
      <header className={styles.header}>
        <h2>Sale Report</h2>
        {/* Simple date range controls */}
        <div className={styles.toolbar}>
          <button
            onClick={() =>
              setRange({
                start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
                end: today,
              })
            }
          >
            Last 7 Days
          </button>
          <button
            onClick={() =>
              setRange({
                start: new Date(today.getFullYear(), today.getMonth(), 1),
                end: today,
              })
            }
          >
            This Month
          </button>
        </div>
      </header>

      {loading && <p>Loading sales…</p>}
      {error && <p className={styles.error}>Error: {error}</p>}

      <main className={styles.content}>
        {data.map((group: DayGroup) => (
          <DayGroupCard key={group.dateLabel} group={group} />
        ))}
      </main>
    </div>
  );
}
