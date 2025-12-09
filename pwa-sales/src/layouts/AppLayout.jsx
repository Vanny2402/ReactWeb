import { useState } from "react";
import { useLocation } from "react-router-dom";
import SideMenu from "../components/SideMenu";
import BottomNav from "../components/BottomNav";

export default function AppLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Auto title from path
  const pageTitleMap = {
    "/": "Dashboard",
    "/customers": "អតិថិជន",
    "/customers/add": "បង្កើតអតិថិជន",
    "/products": "ផលិតផល",
    "/products/add": "បង្កើតផលិតផលថ្មី",
    "/sales": "ការលក់",
    "/payments": "ការបង់ប្រាក់",
    "/settings": "ការកំណត់",
  };

  const title = pageTitleMap[pathname] || "Invoice App";

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md p-4 flex items-center gap-3 z-40">
        <button onClick={() => setMenuOpen(true)}>
          <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h18M4 12h18M4 18h18" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">{title}</h1>
      </header>

      {/* Side Menu */}
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Main Content */}
      <main className="pt-16 pb-20 px-4 flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
