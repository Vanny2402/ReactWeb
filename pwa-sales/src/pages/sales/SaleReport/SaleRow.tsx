import React from "react";
import { Sale } from "./types";
import styles from "./saleReport.module.css";

type Props = {
  sale: Sale;
};


export default function SaleRow({ sale }: Props) {
  const formattedTime = new Date(sale.dateTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDateTime = new Date(sale.dateTime).toLocaleString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <li className={styles.saleRow}>
      {/* Header: order number + total amount */}
      <div className={styles.saleTop}>
        <span className={styles.name}>{sale.customerName}</span>
        <span className={styles.amount}>${sale.totalAmount.toFixed(2)}</span>
      </div>

      {/* Meta info: payment method + time */}
      <div className={styles.saleMeta}>
        {/* <span className={styles.dateTime}>{formattedDateTime}</span> */}
      </div>

      {/* Items grid */}
      <ul className={styles.items}>
        {sale.items.map((item, idx) => (
          <li key={idx} className={styles.item}>
            <span className={styles.name}>{item.name}</span>
            <span className={styles.price}>${item.unitPrice.toFixed(2)}</span>
            <span className={styles.qty}>×{item.qty}</span>
          </li>
        ))}
      </ul>

      {/* Optional note */}
      {sale.note && (
        <div className={styles.note}>
          {sale.note.includes("Delivery") ? "🚚 " : ""}
          {sale.note}
        </div>
      )}
    </li>
  );
}
