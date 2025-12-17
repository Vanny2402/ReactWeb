import { useState } from "react";
import SideMenu from "../components/SideMenu";
import BottomNav from "../components/BottomNav";

export default function AppLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // 👇 flip this flag to control where "Customers" link shows
  const showCustomersInBottomNav = false; // true → BottomNav, false → SideMenu

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md p-4 flex items-center gap-3 z-40">
        <button onClick={() => setMenuOpen(true)}>
          <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h18M4 12h18M4 18h18" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">គ្រប់គ្រងការលក់</h1>
      </header>

      {/* Side Menu */}
      <SideMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        showCustomers={!showCustomersInBottomNav} // 👈 flip logic
      />

      {/* Main Content */}
      <main className="pt-16 pb-20 px-4 flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav showCustomers={showCustomersInBottomNav} />
    </div>
  );
}
