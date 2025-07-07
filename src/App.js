import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import SupplierDashboard from "./pages/SupplierDashboard"; 
import Login from "./pages/Login";
import PurchasingDashboard from "./pages/PurchasingManager/DashBoard/Dashboard";
import InventoryDashboard from "./pages/InventoryManager/InventoryDashboard";
import InventoryMonitoring from "./pages/InventoryManager/InventoryMonitoring";
import EquipmentScheduling from "./pages/InventoryManager/EquipmentScheduling";
import Maintenance from "./pages/InventoryManager/Maintenance";
import MaterialRequest from "./pages/InventoryManager/MaterialRequest";
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
    path: "/login",
    element: <Login />
  },
  {
    path: "/dashboard",
    element: <PurchasingDashboard />
  },
  {
  path: "/inventory-dashboard",
  element: <InventoryDashboard />
  },
  {
  path: "/inventory-monitoring",
  element: <InventoryMonitoring />
},
{
  path: "/equipment-scheduling",
  element: <EquipmentScheduling />,
},
{
  path: "/maintenance",
  element: <Maintenance />,
},
{
  path: "/material-request",
  element: <MaterialRequest />,
}
]);
