import { NavLink } from "react-router-dom";
import { FiHome, FiShoppingCart, FiCreditCard, FiSettings } from "react-icons/fi";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t flex justify-around py-3 z-50">
      
      <NavLink 
        to="/" 
        className="flex flex-col items-center text-gray-500"
      >
        <FiHome size={22} />
        <span className="text-xs">Home</span>
      </NavLink>

      <NavLink 
        to="/sales" 
        className="flex flex-col items-center text-gray-500"
      >
        <FiShoppingCart size={22} />
        <span className="text-xs">Sales</span>
      </NavLink>

      <NavLink 
        to="/payments" 
        className="flex flex-col items-center text-gray-500"
      >
        <FiCreditCard size={22} />
        <span className="text-xs">Payments</span>
      </NavLink>

      <NavLink 
        to="/settings" 
        className="flex flex-col items-center text-gray-500"
      >
        <FiSettings size={22} />
        <span className="text-xs">Settings</span>
      </NavLink>

    </nav>
  );
}


