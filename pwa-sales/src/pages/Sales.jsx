import React from "react";
import { Link } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import { useSaleReport } from "../pages/sales/saleReport/hooks/useSaleReport";
import SaleRow from "../pages/sales/saleReport/SaleRow";

function Sidebar() {
  return (
    <nav>
      <ul>
        {/* other links */}
        <li>
          <Link to="/sales/report">Sale Report</Link>
        </li>
      </ul>
    </nav>
  );
}

export default function Sales() {
  // Example: fetch last 7 days
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 7);

  const { data, loading, error } = useSaleReport(start, end);

  return (
    <MainLayout title="Sales Records">
      <Sidebar />

      <section>
        {loading && <p>Loading sales...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {!loading && !error && (
          <ul>
            {data.map((dayGroup) => (
              <li key={dayGroup.dateLabel}>
                <div className="dayHeader">
                  <span>{dayGroup.dateLabel}</span>
                  <span>
                    ${dayGroup.totalAmount.toFixed(2)} (x{dayGroup.totalQty})
                  </span>
                </div>
                <ul>
                  {dayGroup.sales.map((sale) => (
                    <SaleRow key={sale.orderNo} sale={sale} />
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>
    </MainLayout>
  );
}
