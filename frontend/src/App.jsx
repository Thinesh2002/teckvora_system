import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./pages/components/header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import EbayKeywordGenerator from "./pages/keyword";
import ProductDashboard from "./pages/Product/ProductDashboard";
import AddProduct from "./pages/Product/AddProduct";
import EditProduct from "./pages/Product/EditProduct";
import "./css/login.css";

function AppContent() {
  const location = useLocation();

  // Hide header on these pages
  const hideHeaderPaths = ["/", "/register"];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/keyword" element={<EbayKeywordGenerator />} />
        <Route path="/product-dashboard" element={<ProductDashboard />} />
         <Route path="/add-product" element={<AddProduct />} />
         <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
