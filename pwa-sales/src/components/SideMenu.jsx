import { Link } from "react-router-dom";
import { FiPlus, FiUsers, FiBox, FiX, FiShoppingBag, FiShoppingCart } from "react-icons/fi";

export default function SideMenu({ isOpen, onClose }) {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-30 z-50 transition-opacity ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      onClick={onClose} // close when clicking outside
    >
      <div
        className={`absolute left-0 top-0 h-full w-64 bg-white shadow-lg p-5 transition-transform 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside box
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">មីនុយ</h2>
          <FiX size={22} onClick={onClose} className="cursor-pointer" />
        </div>

        <nav className="flex flex-col gap-4">
          {/* <Link 
            to="/customers/add" 
            className="flex items-center gap-3 text-gray-700"
            onClick={onClose} 
          >
            <FiPlus size={18} /> Add Customer
          </Link>

          <Link 
            to="/products/add" 
            className="flex items-center gap-3 text-gray-700"
            onClick={onClose}
          >
            <FiPlus size={18} /> Add Product
          </Link> */}

          <Link
            to="/customers"
            className="flex items-center gap-3 text-gray-700"
            onClick={onClose}
          >
            <FiUsers size={18} /> អតិថិជន
          </Link>

          <Link
            to="/products"
            className="flex items-center gap-3 text-gray-700"
            onClick={onClose}
          >
            <FiBox size={18} /> ផលិតផល
          </Link>



          <Link
            to="/##"
            className="flex items-center gap-3 text-gray-700"
            onClick={onClose}
          >
            <FiShoppingBag size={18} /> ទិញចូល
          </Link>
        </nav>
      </div>
    </div>
  );
}
