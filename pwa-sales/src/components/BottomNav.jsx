import { NavLink } from "react-router-dom";
import { FiUsers, FiBox, FiShoppingBag } from "react-icons/fi";
import { FiCreditCard } from "react-icons/fi";
export default function BottomNav() {
  const base = "flex flex-col items-center text-xs";

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t flex justify-around py-3 z-50">


      <NavLink to="/products" className={({ isActive }) => `${base} ${isActive ? "text-blue-600" : "text-gray-500"}`}>
        <FiBox size={22} />
        ផលិតផល
      </NavLink>

      <NavLink
        to="/payments"
        className={({ isActive }) => `${base} ${isActive ? "text-blue-600" : "text-gray-500"}`}
      >
        <FiCreditCard size={22} />
        បង់ប្រាក់
      </NavLink>

      <NavLink 
        to="purchases" className={({ isActive }) => `${base} ${isActive ? "text-blue-600" : "text-gray-500"}`}>
        <FiShoppingBag size={22} />
        ទិញចូល
      </NavLink>

      <NavLink to="/customers" className={({ isActive }) => `${base} ${isActive ? "text-blue-600" : "text-gray-500"}`}>
        <FiUsers size={22} />
        អតិថិជន
      </NavLink>


    </nav>
  );
}
