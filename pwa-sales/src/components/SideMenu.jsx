import { Link } from "react-router-dom";
import React from "react";
<Link to="/sales/report">Sale Reports</Link>

import { FiX, FiHome, FiShoppingCart, FiCreditCard, FiSettings } from "react-icons/fi";

export default function SideMenu({ isOpen, onClose }) {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-30 z-50 transition-opacity ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
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
          <Link
            to="/"
            className="flex items-center gap-3 text-gray-700"
            onClick={onClose}
          >
            <FiHome size={18} /> ផ្ទាំងខាងដើម
          </Link>

          <Link
            to="/sales/report"
            className="flex items-center gap-3 text-gray-700"
            onClick={onClose}
          >
            <FiShoppingCart size={18} /> ការលក់
          </Link>

          <Link
            to="/payments"
            className="flex items-center gap-3 text-gray-700"
            onClick={onClose}
          >
            <FiCreditCard size={18} /> ការបង់ប្រាក់
          </Link>

          <Link
            to="/settings"
            className="flex items-center gap-3 text-gray-700"
            onClick={onClose}
          >
            <FiSettings size={18} /> ការកំណត់
          </Link>
        </nav>
      </div>
    </div>
  );
}
