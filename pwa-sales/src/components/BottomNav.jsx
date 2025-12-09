import { NavLink } from "react-router-dom";
import { FiHome, FiShoppingCart, FiCreditCard, FiSettings } from "react-icons/fi";

export default function BottomNav() {
  const base = "flex flex-col items-center text-xs";

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t flex justify-around py-3 z-50">

      <NavLink to="/" className={({ isActive }) => `${base} ${isActive ? "text-blue-600" : "text-gray-500"}`}>
        <FiHome size={22} />
        ផ្ទាំងខាងដើម
      </NavLink>

      <NavLink to="/sales" className={({ isActive }) => `${base} ${isActive ? "text-blue-600" : "text-gray-500"}`}>
        <FiShoppingCart size={22} />
        ការលក់
      </NavLink>

      <NavLink to="/payments" className={({ isActive }) => `${base} ${isActive ? "text-blue-600" : "text-gray-500"}`}>
        <FiCreditCard size={22} />
        ការបង់ប្រាក់
      </NavLink>

      <NavLink to="/settings" className={({ isActive }) => `${base} ${isActive ? "text-blue-600" : "text-gray-500"}`}>
        <FiSettings size={22} />
        ការកំណត់
      </NavLink>

    </nav>
  );
}