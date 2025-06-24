import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import SupplierDashboard from "./pages/SupplierDashboard"; 
import Login from "./pages/Login";
import PurchasingDashboard from "./pages/PurchasingManager/DashBoard/Dashboard";
import Create_Project from "./pages/SiteManager/Create_Project";
import MaintenanceDashboard from "./pages/MaintenanceHead/MaintenanceDashboard";
import MaintenanceMaterialRequest from "./pages/MaintenanceHead/MaintenanceMaterialRequest";
import MaintenanceRequestTracker from "./pages/MaintenanceHead/MaintenanceTracker";
import EquipmentLogContainer from "./pages/MaintenanceHead/EquipmentLog";
import ServiceHistoryContainer from "./pages/MaintenanceHead/MaintenanceLog";
import TechnicianAssignmentMain from "./pages/MaintenanceHead/TechnicianAssign";

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
    path: "/create-project",
    element: <Create_Project />
  },
  {
    path: "/maintenance-dashboard",
    element: <MaintenanceDashboard/>
  },
  {
    path: "/maintenance-requests",
    element: <MaintenanceMaterialRequest/>
  },
  {
    path: "/maintenance-tracker",
    element: <MaintenanceRequestTracker/>
  },
  {
    path: "equipment",
    element: <EquipmentLogContainer/>
  },
  {
    path: "/maintenance-log",
    element: <ServiceHistoryContainer />
  },
  {
    path: "/technician-assignment",
    element: <TechnicianAssignmentMain />
  }
]);
