import React from "react";
import { Trash2 } from "lucide-react";

const SaleRow = React.memo(function SaleRow({ sale, onOpen, onDelete }) {
  return (
    <div
      onClick={() => onOpen(sale.id)}
      className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition"
    >
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
        {sale.customer?.name?.substring(0, 2)?.toUpperCase()}
      </div>

      <div className="flex-1">
        <p className="text-sm font-bold text-blue-600">
          {sale.customer?.name} #{sale.id}
        </p>
        <p className="text-xs text-gray-500">
          {new Date(sale.createdAt).toLocaleString()}
        </p>
      </div>

      <p className="text-sm font-semibold text-blue-600">
        ${Number(sale.totalPrice || 0).toFixed(2)}
      </p>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(sale.id);
        }}
        className="ml-2 p-1 rounded hover:bg-gray-100"
      >
        <Trash2 size={18} className="text-red-500" />
      </button>
    </div>
  );
});

export default SaleRow;
