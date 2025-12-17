import { NavLink } from "react-router-dom";
import {
  FiBox,
  FiShoppingBag,
  FiCreditCard,
  FiUsers,
  FiShoppingCart, // 👈 add icon for Sale
} from "react-icons/fi";

export default function BottomNav() {
  const base = "flex flex-col items-center text-xs";

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t flex justify-around py-3 z-50">

      {/* Sale Add */}
      <NavLink
        to="/sales/List"
        className={({ isActive }) =>
          `${base} ${isActive ? "text-blue-600" : "text-gray-500"}`
        }
      >
        <FiShoppingCart size={22} />
        ការលក់
      </NavLink>
      {/* Products */}
      <NavLink
        to="/products"
        className={({ isActive }) =>
          `${base} ${isActive ? "text-blue-600" : "text-gray-500"}`
        }
      >
        <FiBox size={22} />
        ផលិតផល
      </NavLink>

      {/* Payments */}
      <NavLink
        to="/payments"
        className={({ isActive }) =>
          `${base} ${isActive ? "text-blue-600" : "text-gray-500"}`
        }
      >
        <FiCreditCard size={22} />
        ការបង់ប្រាក់
      </NavLink>

      {/* Customers */}
      <NavLink
        to="/customers"
        className={({ isActive }) =>
          `${base} ${isActive ? "text-blue-600" : "text-gray-500"}`
        }
      >
        <FiUsers size={22} />
        អតិថិជន
      </NavLink>


    </nav>
  );
}
