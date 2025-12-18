import { Link, NavLink } from "react-router-dom";
import {
  FiX,
  FiHome,
  FiShoppingCart,
  FiSettings,
  FiShoppingBag,   // 👈 add this
} from "react-icons/fi";

export default function SideMenu({ isOpen, onClose }) {
  const base = "flex items-center gap-3 text-gray-700";

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-30 z-50 transition-opacity ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      onClick={onClose}
    >
      <div
        className={`absolute left-0 top-0 h-full w-64 bg-white shadow-lg p-5 transition-transform 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">មីនុយ</h2>
          <FiX size={22} onClick={onClose} className="cursor-pointer" />
        </div>

        <nav className="flex flex-col gap-4">
          {/* <Link to="/" onClick={onClose} className={base}>
            <FiHome size={18} /> ផ្ទាំងខាងដើម
          </Link> */}
          <NavLink
            to="/purchases"
            onClick={onClose}
            className={({ isActive }) =>
              `${base} ${isActive ? "text-blue-600 font-semibold" : ""}`
            }
          >
            <FiShoppingBag size={22} />
            ទិញចូល
          </NavLink>

          <Link to="/sales/report" onClick={onClose} className={base}>
            <FiShoppingCart size={18} /> ការលក់s
          </Link>
          {/* 
          <Link to="/settings" onClick={onClose} className={base}>
            <FiSettings size={18} /> ការកំណត់
          </Link> */}

          {/* Purchases (NavLink with active state) */}

        </nav>
      </div>
    </div>
  );
}
