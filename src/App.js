import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import SupplierDashboard from "./pages/Supplier/SupplierDashboard";
import MaterialRequests from "./pages/Supplier/MaterialRequests";
import RequestDetails from "./pages/Supplier/RequestDetails";
import SubmitQuotation from "./pages/Supplier/SubmitQuotation";
import QuotationStatus from "./pages/Supplier/QuotationStatus";
import Login from "./pages/Login";
import PurchasingDashboard from "./pages/PurchasingManager/DashBoard/Dashboard";
import Create_Project from "./pages/SiteManager/Create_Project";
import Edit_Project from "./pages/SiteManager/Edit_Project";
import Project_Phase from "./pages/SiteManager/Project_Phase";
import Create_Material_Request from "./pages/SiteManager/Create_Material_Request";
import Material_Request from "./pages/SiteManager/Material_Request";
import Site_EquipmentInfo from "./pages/SiteManager/Site_EquipmentInfo";
import Site_EquipmentRequest from "./pages/SiteManager/Site_EquipmentRequest";
import Site_MaterialInfo from "./pages/SiteManager/Site_MaterialInfo";
import Site_MaterialAdd from "./pages/SiteManager/Site_MaterialAdd";
import Site_MaterialUpdate from "./pages/SiteManager/Site_MaterialUpdate";
import Purchase_Order from "./pages/SiteManager/Purchase_Order";
import SiteManager_Profile from "./pages/SiteManager/SiteManager_Profile";
import SiteManagerDashboard from "./pages/SiteManager/SiteManagerDashboard";
import Existing_Projects_List from "./pages/SiteManager/Existing_Projects_List";

import Admin_Dashbaord from "./pages/Admin/Admin-Dashboard";
import Admin_Inventory from "./pages/Admin/Admin-Inventory";
import ConstructionDashboard from "./components/Admin/admin-dashboard";
import UserDashboard from "./components/Admin/admin-users";

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
  },

  // SITE MANAGER
  {
    path: "/site-manager",
    element: <SiteManagerDashboard />
  },
  {
    path: "/create-project",
    element: <Create_Project />
  },
  {
    path: "/edit-project",
    element: <Edit_Project />
  },
  {
    path: "/projects-list",
    element: <Existing_Projects_List />
  },
  {
    path: "/project-phase",
    element: <Project_Phase />
  },
  {
    path: "/material-request",
    element: <Create_Material_Request />
  },
  {
    path: "/material-request-list",
    element: <Material_Request />
  },
  {
    path: "/site-equipment-info",
    element: <Site_EquipmentInfo />
  },
  {
    path: "/site-equipment-request",
    element: <Site_EquipmentRequest />
  },
  {
    path: "/site-material-info",
    element: <Site_MaterialInfo />
  },
  {
    path: "/site-material-add",
    element: <Site_MaterialAdd />
  },
  {
    path: "/site-material-update",
    element: <Site_MaterialUpdate />
  },
  {
    path: "/purchase-order",
    element: <Purchase_Order />
  },
  {
    path: "/site-manager-profile",
    element: <SiteManager_Profile />
  },
  {
    path: "/admin",
    element:<ConstructionDashboard/>
  },
  {
    path: "/admin-inventory",
    element:<Admin_Inventory/>
  },
  {
    path: "/admin-users",
    element:<UserDashboard/>
  }
]);
