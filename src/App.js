import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import SupplierDashboard from "./pages/Supplier/SupplierDashboard";
import MaterialRequests from "./pages/Supplier/MaterialRequests";
import RequestDetails from "./pages/Supplier/RequestDetails";
import SubmitQuotation from "./pages/Supplier/SubmitQuotation";
import QuotationStatus from "./pages/Supplier/QuotationStatus";
import Login from "./pages/Login";
import PurchasingDashboard from "./pages/PurchasingManager/DashBoard/Dashboard";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/dashboard1",
    element: <SupplierDashboard/>
},
 {
    path: "/requests",
    element: <MaterialRequests/>
  },
  {
    path: "/requests/:id",
    element: <RequestDetails />,
  },
  { path: "/quotations/submit", element: <SubmitQuotation /> },
  { path: "/quotations", element: <QuotationStatus /> },
{
    path: "/login",
    element: <Login />
  },
  {
    path: "/dashboard",
    element: <PurchasingDashboard />
  }
]);
