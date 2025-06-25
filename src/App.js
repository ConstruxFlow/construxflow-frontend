import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import SupplierDashboard from "./pages/SupplierDashboard";
import Login from "./pages/Login";
import PurchasingDashboard from "./pages/PurchasingManager/DashBoard/Dashboard";
import Create_Project from "./pages/SiteManager/Create_Project";
import MaterialRequestsOverview from "./pages/PurchasingManager/Material_Requests/Request_Dashboard";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard1",
    element: <SupplierDashboard />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/purchasingdashboard",
    element: <PurchasingDashboard />,
  },
  {
    path: "/materialrequestsoverview",
    element: <MaterialRequestsOverview />,
  },
  {
    path: "/create-project",
    element: <Create_Project />,
  },
]);
