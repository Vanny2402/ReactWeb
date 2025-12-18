import { Outlet } from "react-router-dom";
import { useState } from "react";
import SideMenu from "../components/SideMenu";
import BottomNav from "../components/BottomNav";

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* Header */}
      <header className="bg-white shadow p-4 flex items-center">
        <button onClick={() => setMenuOpen(true)}>☰</button>
        <h1 className="ml-4 font-semibold">គ្រប់គ្រងការលក់</h1>
      </header>

      {/* Side Menu */}
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Page Content */}
      <main className="p-4">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
