// Pages/sales/SaleReport/types.ts

export type SaleItem = {
  name: string;         // from item.product.name
  unitPrice: number;    // from item.price
  qty: number;          // from item.qty
};

export type Sale = {
  orderNo: string;      // from id (convert to string)
  dateTime: string;     // from createdAt
  paymentMethod: string; // optional, hardcode or map later
  totalAmount: number;  // from totalPrice
  note?: string;        // from remark
  items: SaleItem[];
};

export type DayGroup = {
  dateLabel: string;         // e.g. "Sat, 6/12/2025"
  totalAmount: number;       // sum of sales in that day
  totalQty: number;          // sum of item quantities in that day
  sales: Sale[];
};
