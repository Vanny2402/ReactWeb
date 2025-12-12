// Pages/sales/SaleReport/DayGroupCard.tsx
import { DayGroup } from "./types";
import SaleRow from "./SaleRow";
import { fmtCurrency } from "./formatters";
import styles from "./saleReport.module.css";


type Props = {
  group: DayGroup;
};

export default function DayGroupCard({ group }: Props) {
  return (
    <section className={styles.dayCard}>
      {/* Day header with total amount and total quantity */}
      <div className={styles.dayHeader}>
        <span className={styles.dayTitle}>{group.dateLabel}</span>
        <span className={styles.dayTotal}>
          {fmtCurrency(group.totalAmount)} (×{group.totalQty})
        </span>
      </div>

      {/* List of sales for this day */}
      <ul className={styles.salesList}>
        {group.sales.map((sale) => (
          <SaleRow key={sale.orderNo} sale={sale} />
        ))}
      </ul>
    </section>
  );
}
