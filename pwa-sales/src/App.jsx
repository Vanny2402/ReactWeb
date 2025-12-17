import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";

import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Settings from "./pages/Settings";

import CustomerList from "./pages/customers/CustomerList";
import CustomerAdd from "./pages/customers/CustomerAdd";
import CustomerEdit from "./pages/customers/CustomerEdit";
import CustomerDetails from "./pages/customers/CustomerDetails";

import ProductList from "./pages/products/ProductList";
import ProductAdd from "./pages/products/ProductAdd";
import ProductEdit from "./pages/products/ProductEdit";

import ProductSale from "./pages/sales/ProductSale";
import SaleReportPage from "./pages/sales/SaleReport/SaleReportPage";
import SaleList from "./pages/sales/SaleList";
import SaleDetails from "./pages/sales/SaleDetails";
import ProductSalAny from "./pages/sales/ProductSale";

import PaymentList from "./pages/payments/PaymentList";
import PaymentAdd from "./pages/payments/PaymemntAdd";
import PaymentEdit from "./pages/payments/PaymemntEdit";
import PaymentAddFC from "./pages/payments/PaymemntAdd";


import PurchaseList from "./pages/purchases/PurchaseList";
import PurchaseAdd from "./pages/purchases/PurchaseAdd";
import PurchaseEdit from "./pages/purchases/PurchaseEdit";

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
          <Route path="/customers/:id" element={<CustomerDetails />} />

          {/* Products */}
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/add" element={<ProductAdd />} />
          <Route path="/products/edit/:id" element={<ProductEdit />} />

          {/* Sales */}
          <Route path="/sales" element={<Sales />} />
          {/* ⭐ NEW: supports ?customerId=1 or ?productId=33 */}
          <Route path="/sales/ProductSale" element={<ProductSale />} />
          {/* ⭐ OPTIONAL: legacy support for /sales/ProductSale/1 */}
          <Route path="/sales/ProductSale/:id" element={<ProductSale />} />
          <Route path="/sales/report" element={<SaleReportPage />} />
          <Route path="/sales/list" element={<SaleList />} />
          <Route path="/sales/SaleDetails/:id" element={<SaleDetails />} />

          {/* Payments */}
          <Route path="/payments" element={<PaymentList />} />
          <Route path="/payments/add" element={<PaymentAdd />} />
          <Route path="/payments/edit/:id" element={<PaymentEdit />} />
          <Route path="/payments/add/:id" element={<PaymentAddFC />} />

          {/* Purchases */}
          <Route path="/purchases" element={<PurchaseList />} />
          <Route path="/purchases/add" element={<PurchaseAdd />} />
          <Route path="/purchases/edit/:id" element={<PurchaseEdit />} />

          {/* Settings */}
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>

  );
}
