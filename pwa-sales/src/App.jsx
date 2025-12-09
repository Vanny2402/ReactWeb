import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";

import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Payments from "./pages/Payments";
import Settings from "./pages/Settings";

import CustomerList from "./pages/customers/CustomerList";
import CustomerAdd from "./pages/customers/CustomerAdd";
import CustomerEdit from "./pages/customers/CustomerEdit";

import ProductList from "./pages/products/ProductList";
import ProductAdd from "./pages/products/ProductAdd";

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          
          {/* Customers */}
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/add" element={<CustomerAdd />} />
          <Route path="/customers/edit/:id" element={<CustomerEdit />} />

          {/* Products */}
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/add" element={<ProductAdd />} />

          {/* Others */}
          <Route path="/sales" element={<Sales />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}