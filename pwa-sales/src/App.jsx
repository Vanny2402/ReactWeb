import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Sales from "./pages/Sales";
import Payments from "./pages/Payments";
import Settings from "./pages/Settings";
import BottomNav from "./components/BottomNav";

import CustomerList from "./pages/CustomerList";
import CustomerAdd from "./pages/CustomerAdd";
import CustomerEdit from "./pages/CustomerEdit";


export default function App() {
  return (
    <BrowserRouter>
      <div className="pb-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/add" element={<CustomerAdd />} />
          <Route path="/customers/:id" element={<CustomerEdit />} />
        </Routes>
      </div>

      <BottomNav />
    </BrowserRouter>
  );
}

