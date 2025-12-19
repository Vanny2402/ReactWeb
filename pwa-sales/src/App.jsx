import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import ProtectedRoute from "./routes/ProtectedRoute";

// Customers
import CustomerList from "./pages/customers/CustomerList";
import CustomerAdd from "./pages/customers/CustomerAdd";
import CustomerEdit from "./pages/customers/CustomerEdit";
import CustomerDetails from "./pages/customers/CustomerDetails";

// Products
import ProductList from "./pages/products/ProductList";
import ProductAdd from "./pages/products/ProductAdd";
import ProductEdit from "./pages/products/ProductEdit";

// Sales
import Sales from "./pages/Sales";
import ProductSale from "./pages/sales/ProductSale";
import SaleReportPage from "./pages/sales/SaleReport/SaleReportPage";
import SaleList from "./pages/sales/SaleList";
import SaleDetails from "./pages/sales/SaleDetails";

// Payments
import PaymentList from "./pages/payments/PaymentList";
import PaymentAdd from "./pages/payments/PaymemntAdd";
import PaymentEdit from "./pages/payments/PaymemntEdit";
import PaymentAddFC from "./pages/payments/PaymemntAdd";

// Purchases
import PurchaseList from "./pages/purchases/PurchaseList";
import PurchaseAdd from "./pages/purchases/PurchaseAdd";
import PurchaseEdit from "./pages/purchases/PurchaseEdit";

export default function App() {
  useEffect(() => {
    const handleRefresh = () => {
      localStorage.removeItem("isLoggedIn");
    };
    window.addEventListener("beforeunload", handleRefresh);
    return () => window.removeEventListener("beforeunload", handleRefresh);
  }, []);

  const customerRoutes = [
    { path: "customers", element: <CustomerList /> },
    { path: "customers/add", element: <CustomerAdd /> },
    { path: "customers/:id", element: <CustomerDetails /> },
    { path: "customers/edit/:id", element: <CustomerEdit /> },
  ];

  const productRoutes = [
    { path: "products", element: <ProductList /> },
    { path: "products/add", element: <ProductAdd /> },
    { path: "products/edit/:id", element: <ProductEdit /> },
  ];

  const salesRoutes = [
    { path: "sales", element: <Sales /> },
    { path: "sales/ProductSale", element: <ProductSale /> },
    { path: "sales/report", element: <SaleReportPage /> },
    { path: "sales/list", element: <SaleList /> },
    { path: "sales/SaleDetails/:id", element: <SaleDetails /> },
  ];

  const paymentRoutes = [
    { path: "payments", element: <PaymentList /> },
    { path: "payments/add", element: <PaymentAdd /> },
    { path: "payments/edit/:id", element: <PaymentEdit /> },
    { path: "payments/add/:id", element: <PaymentAddFC /> },
  ];

  const purchaseRoutes = [
    { path: "purchases", element: <PurchaseList /> },
    { path: "purchases/add", element: <PurchaseAdd /> },
    { path: "purchases/edit/:id", element: <PurchaseEdit /> },
  ];

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {[...customerRoutes, ...productRoutes, ...salesRoutes, ...paymentRoutes, ...purchaseRoutes].map(
              ({ path, element }, index) => (
                <Route key={index} path={path} element={element} />
              )
            )}
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
