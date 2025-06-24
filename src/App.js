import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import SupplierDashboard from "./pages/SupplierDashboard"; 
import Login from "./pages/Login";
import PurchasingDashboard from "./pages/PurchasingManager/DashBoard/Dashboard";
import Create_Project from "./pages/SiteManager/Create_Project";
import Edit_Project from "./pages/SiteManager/Edit_Project";
import Existing_Projects from "./pages/SiteManager/Existing_Projects";
import Project_Phase from "./pages/SiteManager/Project_Phase";
import Create_Material_Request from "./pages/SiteManager/Create_Material_Request";
import Material_Request from "./pages/SiteManager/Material_Request";
import Site_EquipmentInfo from "./pages/SiteManager/Site_EquipmentInfo";
import Site_EquipmentRequest from "./pages/SiteManager/Site_EquipmentRequest";

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

  // SITE MANAGER
  {
    path: "/create-project",
    element: <Create_Project />
  },
  {
    path: "/edit-project",
    element: <Edit_Project />
  },
  {
    path: "/existing-project",
    element: <Existing_Projects />
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
  }
]);
