import { createBrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import PurchasingDashboard from "./pages/PurchasingManager/DashBoard/Dashboard";
import InventoryDashboard from "./pages/InventoryManager/InventoryDashboard";
import InventoryMonitoring from "./pages/InventoryManager/InventoryMonitoring";
import EquipmentScheduling from "./pages/InventoryManager/EquipmentScheduling";
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
import AddEquipment from "./pages/InventoryManager/AddEquipment";
import AddMaterial from "./pages/InventoryManager/AddMaterial";
import InventoryControl from "./pages/InventoryManager/InventoryControl";
import MaintenanceRequestsOverview from "./pages/InventoryManager/MaintenanceRequestsOverview";
import MaintenanceRequestPage from "./pages/InventoryManager/MaintenanceRequestPage";
import { siteManagerRoutes } from "./pages/SiteManager/Routes";
import Admin_Analysis from "./pages/Admin/Admin-Analysis";
import ContactSupport from "./pages/Supplier/ContactSupport";
import QuotationDetail from "./pages/PurchasingManager/Quotations/QuotationDetails";
import QuotationDetails from "./pages/Supplier/QuotationDetails";
import { FinanceManagerRoutes } from "./pages/FinancialOfficer/routes";
import { SupplierRoutes } from "./pages/Supplier/routes";

import Admin_Dashbaord from "./pages/Admin/Admin-Dashboard";
import Admin_Inventory from "./pages/Admin/Admin-Inventory";
import ConstructionDashboard from "./components/Admin/admin-dashboard";
import UserDashboard from "./components/Admin/admin-users";
import Admin_Users from "./pages/Admin/Admin-User";

import ScheduleForm from "./pages/InventoryManager/ScheduleForm";
import ViewSchedulePage from "./pages/InventoryManager/ViewSchedulePage";
import ReorderMaterialPage from "./pages/InventoryManager/ReorderMaterialPage";
import Profile from "./pages/InventoryManager/InventoryManagerProfile";
import Admin_Dashboard from "./pages/Admin/Admin-Dashboard";
import ManagerProfileView from "./pages/Admin/ManagerProfile";
import AdminProjectsList from "./pages/Admin/AdminProjectsList";
import AdminProjectDetails from "./pages/Admin/AdminProjectDetails";
import ManagerReg from "./pages/Admin/ManagerReg";
import InventoryProfile from "./pages/InventoryManager/ManagerProfile";
import InventoryRequests from "./pages/InventoryManager/InventoryRequests";
import UpdateInventory from "./pages/InventoryManager/UpdateInventory";
import EquipmentDetails from "./pages/InventoryManager/EquipmentDetails";
// ADD THE MISSING IMPORT
import ScheduleEquipment from "./pages/InventoryManager/ScheduleEquipment";
import ProtectedRoute from "./Context/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  // Supplier
  {
    path: "/supplier",
    element: <ProtectedRoute allowedRoles={"Supplier"} />,
    children: SupplierRoutes.children,
  },

  // Finance Officer
  {
    path: "/financial",
    element: <ProtectedRoute allowedRoles={"Finance_Officer"} />,
    children: FinanceManagerRoutes.children,
  },

  // PURCHASING MANAGER
  {
    path: "/purchasing",
    element: <ProtectedRoute allowedRoles={"Purchasing_Manager"} />,
    children: purchasingManagerRoutes.children,
  },

  // SITE MANAGER
  {
    path: "/site-manager",
    element: <ProtectedRoute allowedRoles={["Site_Manager"]} />,
    children: siteManagerRoutes.children,
  },

  // MAINTENANCE HEAD
  {
    path: "/maintenance",
    element: <ProtectedRoute allowedRoles={["Maintenance_Head"]} />,
    children: MaintenanceRoute.children,
  },
  {
    path: "/login",
    element: <Login />,
  },

  // admin routes
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={["Admin"]} />,
    children: [
      { path: "", element: <Admin_Dashboard /> },
      { path: "profile", element: <ManagerProfileView /> },
      { path: "projects-list", element: <AdminProjectsList /> },
      { path: "projects-list/:projectId", element: <AdminProjectDetails /> },
    ],
  },
  {
    path: "/admin-inventory",
    element: <ProtectedRoute allowedRoles={["Admin"]} />,
    children: [{ path: "", element: <Admin_Inventory /> }],
  },
  {
    path: "/admin-users",
    element: <ProtectedRoute allowedRoles={["Admin"]} />,
    children: [{ path: "", element: <Admin_Users /> }],
  },
  {
    path: "/admin-managers",
    element: <ProtectedRoute allowedRoles={["Admin"]} />,
    children: [{ path: "", element: <ManagerReg /> }],
  },
  {
    path: "/admin-analysis",
    element: <ProtectedRoute allowedRoles={["Admin"]} />,
    children: [{ path: "", element: <Admin_Analysis /> }],
  },

  // INVENTORY MANAGER
  {
    path: "/inventory-control",
    element: <ProtectedRoute allowedRoles={["Inventory_Manager"]} />,
    children: [{ path: "", element: <InventoryControl /> }],
  },
  {
    path: "/maintenance-requests-overview",
    element: <ProtectedRoute allowedRoles={["Inventory_Manager"]} />,
    children: [{ path: "", element: <MaintenanceRequestsOverview /> }],
  },
  {
    path: "/maintenance-request-page",
    element: <ProtectedRoute allowedRoles={["Inventory_Manager"]} />,
    children: [{ path: "", element: <MaintenanceRequestPage /> }],
  },
  {
    path: "/maintenance-request-page/:equipmentId",
    element: <ProtectedRoute allowedRoles={["Inventory_Manager"]} />,
    children: [{ path: "", element: <MaintenanceRequestPage /> }],
  },
  {
    path: "/shedule-form",
    element: <ProtectedRoute allowedRoles={["Inventory_Manager"]} />,
    children: [{ path: "", element: <ScheduleForm /> }],
  },
  {
    path: "/reorder-material-page",
    element: <ProtectedRoute allowedRoles={["Inventory_Manager"]} />,
    children: [{ path: "", element: <ReorderMaterialPage /> }],
  },
  {
    path: "/Inventory/profile",
    element: <ProtectedRoute allowedRoles={["Inventory_Manager"]} />,
    children: [{ path: "", element: <InventoryProfile /> }],
  },
  {
    path: "/Inventory-requests",
    element: <ProtectedRoute allowedRoles={["Inventory_Manager"]} />,
    children: [{ path: "", element: <InventoryRequests /> }],
  },
  {
    path: "/update-inventory",
    element: <ProtectedRoute allowedRoles={["Inventory_Manager"]} />,
    children: [{ path: "", element: <UpdateInventory /> }],
  },
  {
    path: "/schedule-form/:equipmentId",
    element: <ProtectedRoute allowedRoles={["Inventory_Manager"]} />,
    children: [{ path: "", element: <ScheduleEquipment /> }],
  },
  {
    path: "/equipment-details/:id",
    element: <ProtectedRoute allowedRoles={["Inventory_Manager"]} />,
    children: [{ path: "", element: <EquipmentDetails /> }],
  },
  {
    path: "/view-schedule-page/:id",
    element: <ProtectedRoute allowedRoles={["Inventory_Manager"]} />,
    children: [{ path: "", element: <ViewSchedulePage /> }],
  },
  {
    path: "/inventory-dashboard",
    element: <ProtectedRoute allowedRoles={"Inventory_Manager"} />,
    children: [{ path: "", element: <InventoryDashboard /> }],
  },
  {
    path: "/inventory-monitoring",
    element: <ProtectedRoute allowedRoles={"Inventory_Manager"} />,
    children: [{ path: "", element: <InventoryMonitoring /> }],
  },
  {
    path: "/add-equipment",
    element: <ProtectedRoute allowedRoles={"Inventory_Manager"} />,
    children: [{ path: "", element: <AddEquipment /> }],
  },
  {
    path: "/add-material",
    element: <ProtectedRoute allowedRoles={"Inventory_Manager"} />,
    children: [{ path: "", element: <AddMaterial /> }],
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/dashboard1",
    element: <SupplierDashboard />,
  },

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
    element: <ProtectedRoute allowedRoles={["Site_Manager"]} />,
    children: [{ path: "", element: <Existing_Projects_List /> }],
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
    path: "/equipment-scheduling",
    element: <EquipmentScheduling />,
  },
  {
    path: "/material-request",
    element: <MaterialRequest />,
  },
  {
    path: "/requests",
    element: <MaterialRequests />,
  },
  {
    path: "/requests/:id",
    element: <RequestDetails />,
  },
  {
    path: "/quotations/submit",
    element: <SubmitQuotation />,
  },
  {
    path: "/quotations",
    element: <QuotationStatus />,
  },
  {
    path: "/payments/receive-advanced",
    element: <ReceiveAdvancedPayment />,
  },
  {
    path: "/payments/receive-full",
    element: <ReceiveFullPayment />,
  },
  {
    path: "/orders",
    element: <PurchasingOrders />,
  },
  {
    path: "/orders/:id",
    element: <OrderDetails />,
  },
  {
    path: "/payments",
    element: <PaymentStatus />,
  },
  {
    path: "/supplierprofile",
    element: <SupplierProfile />,
  },
  {
    path: "/supplierprofile/edit",
    element: <SupplierProfileEdit />,
  },

  {
    path: "/verify-email",
    element: <VerificationEmailPage />,
  },
  // REMOVED THE EXTRA "ReorderMaterialPage" text that was causing syntax error
]);
