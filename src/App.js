import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PurchasingDashboard from "./pages/PurchasingManager/DashBoard/Dashboard";
import InventoryDashboard from "./pages/InventoryManager/InventoryDashboard";
import InventoryMonitoring from "./pages/InventoryManager/InventoryMonitoring";
import EquipmentScheduling from "./pages/InventoryManager/EquipmentScheduling";
import Maintenance from "./pages/InventoryManager/Maintenance";
import MaterialRequest from "./pages/InventoryManager/MaterialRequest";
import Create_Project from "./pages/SiteManager/Create_Project";
import MaintenanceDashboard from "./pages/MaintenanceHead/MaintenanceDashboard";
import MaintenanceMaterialRequest from "./pages/MaintenanceHead/MaintenanceMaterialRequest";
import MaintenanceRequestTracker from "./pages/MaintenanceHead/MaintenanceTracker";
import EquipmentLogContainer from "./pages/MaintenanceHead/EquipmentLog";
import ServiceHistoryContainer from "./pages/MaintenanceHead/MaintenanceLog";
import TechnicianAssignmentMain from "./pages/MaintenanceHead/TechnicianAssign";
import TechnicianAssignmentContainer from "./pages/MaintenanceHead/UpcomingSchedule";
import NextScheduleContainer from "./pages/MaintenanceHead/UpcomingSchedule";
import TaskCompleteContainer from "./pages/MaintenanceHead/TaskComplete";
import WorkerProfile from "./pages/MaintenanceHead/WorkerProfile";
import ProfileManagement from "./pages/MaintenanceHead/MaintenanceProfile";
import MaintenanceScheduling from "./pages/MaintenanceHead/MaintenanceScheduling";
import SupplierDashboard from "./pages/Supplier/SupplierDashboard";
import MaterialRequests from "./pages/Supplier/MaterialRequests";
import RequestDetails from "./pages/Supplier/RequestDetails";
import SubmitQuotation from "./pages/Supplier/SubmitQuotation";
import QuotationStatus from "./pages/Supplier/QuotationStatus";
import PurchasingOrders from "./pages/Supplier/PurchasingOrders";
import OrderDetails from "./pages/Supplier/OrderDetails";
import PaymentStatus from "./pages/Supplier/PaymentStatus";
import ReceiveAdvancedPayment from "./pages/Supplier/ReceiveAdvancedPayment";
import ReceiveFullPayment from "./pages/Supplier/ReceiveFullPayment";
import SupplierProfile from "./pages/Supplier/Profile";
import SupplierProfileEdit from "./pages/Supplier/EditProfile";
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
import MaterialReqDetails from "./pages/PurchasingManager/Material_Requests/MaterialReqDetails";
import MaterialReqDetails_MWise from "./pages/PurchasingManager/Material_Requests/MaterialReqDetails_MWise";
import CreateMaterialRequest from "./pages/PurchasingManager/Material_Requests/CreateMaterialRequest";
import SupplierPerformanceEvaluation from "./pages/PurchasingManager/Suppliers/SupplierPerformanceEvaluation";
import {
  purchasingManagerRoutes,
  PurchasingManagerroutes,
} from "./pages/PurchasingManager/Routes";
import { MaintenanceRoute } from "./pages/MaintenanceHead/MaintenanceRoute";
import VerificationEmailPage from "./components/EmailVerify";
import BOQPDFReader from "./pages/BOQPDFReader";

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
},
   { path: "/requests",
    element: <MaterialRequests />,
  },
  {
    path: "/requests/:id",
    element: <RequestDetails />,
  },
  { path: "/quotations/submit", element: <SubmitQuotation /> },
  { path: "/quotations", element: <QuotationStatus /> },
  { path: "/payments/receive-advanced", element: <ReceiveAdvancedPayment /> },
  { path: "/payments/receive-full", element: <ReceiveFullPayment /> },

  {
    path: "/orders",
    element: <PurchasingOrders />,
  },
  {
    path: "/orders/:id",
    element: <OrderDetails />,
  },
  { path: "/payments", element: <PaymentStatus /> },
  { path: "/supplierprofile", element: <SupplierProfile /> },
  { path: "/supplierprofile/edit", element: <SupplierProfileEdit /> },

  {
    path: "/login",
    element: <Login />,
  },

  // PURCHASING MANAGER
  purchasingManagerRoutes,

  // MAINTENANCE HEAD
  MaintenanceRoute,
{
  path: "/pdfreader",
  element: <BOQPDFReader />,
},
  
  // SITE MANAGER
  {
    path: "/site-manager",
    element: <SiteManagerDashboard />,
  },
  {
    path: "/projects-list",
    element: <Existing_Projects_List />,
  },
  {
    path: "/projects-list/create-project",
    element: <Create_Project />,
  },
  {
    path: "/projects-list/edit-project",
    element: <Edit_Project />,
  },
  {
    path: "/projects-list/edit-project/:projectId",
    element: <Edit_Project />,
  },
  {
    path: "/projects-list/create-project/project-phase",
    element: <Project_Phase />,
  },
  {
    path: "/material-request-list/material-request",
    element: <Create_Material_Request />,
  },
  {
    path: "/material-request-list",
    element: <Material_Request />,
  },
  {
    path: "/site-equipment-info",
    element: <Site_EquipmentInfo />,
  },
  {
    path: "/site-equipment-request",
    element: <Site_EquipmentRequest />,
  },
  {
    path: "/site-material-info",
    element: <Site_MaterialInfo />,
  },
  {
    path: "/site-material-add",
    element: <Site_MaterialAdd />,
  },
  {
    path: "/site-material-update",
    element: <Site_MaterialUpdate />,
  },
  {
    path: "/purchase-order",
    element: <Purchase_Order />,
  },
  {
    path: "/site-manager-profile",
    element: <SiteManager_Profile />,
  },
  {
    path: "/verify-email",
    element: <VerificationEmailPage/>
  }
]);
