import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PurchasingDashboard from "./pages/PurchasingManager/DashBoard/Dashboard";


export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/dashboard",
    element: <PurchasingDashboard />
  }
]);
