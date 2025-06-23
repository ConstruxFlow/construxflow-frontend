import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import SupplierDashboard from "./pages/SupplierDashboard"; // Import your dashboard page

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/dashboard",
    element: <SupplierDashboard />
  }
]);
