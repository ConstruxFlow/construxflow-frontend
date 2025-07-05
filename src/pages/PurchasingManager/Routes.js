import { Outlet } from "react-router-dom";
import PurchasingDashboard from "./DashBoard/Dashboard";
import CreateMaterialRequest from "./Material_Requests/CreateMaterialRequest";
import MaterialReqDetails from "./Material_Requests/MaterialReqDetails";
import MaterialReqDetails_MWise from "./Material_Requests/MaterialReqDetails_MWise";
import MaterialRequestsOverview from "./Material_Requests/Request_Dashboard";
import SupplierPerformanceEvaluation from "./Suppliers/SupplierPerformanceEvaluation";
import SupplierRegPage from "./Suppliers/SupplierRegPage";
import ReviewQuotations from "./Quotations/ReviewQuotationsOverview";
import QuotationDetail from "./Quotations/QuotationDetails";
import SupplierList from "./Suppliers/SupplierList";

export const purchasingManagerRoutes = {
  path: '/purchasing',
  element: <Outlet />,
  children: [
    {
      path: 'dashboard',
      element: <PurchasingDashboard />,
    },
    {
      path: 'materialrequests/overview',
      element: <MaterialRequestsOverview />,
    },
    {
      path: 'materialrequests',
      element: <MaterialReqDetails />,
    },
    {
      path: 'materialrequests/mwise',
      element: <MaterialReqDetails_MWise />,
    },
    {
      path: 'materialrequests/create',
      element: <CreateMaterialRequest />,
    },
    {
      path: 'supplier/dashboard',
      element: <SupplierPerformanceEvaluation />,
    },
    {
      path: 'supplier/list',
      element: <SupplierList />,
    },
    {
      path: 'supplier/register',
      element: <SupplierRegPage />,
    },
    {
      path: 'quotations/dashboard',
      element: <ReviewQuotations />,
    },
    {
      path: 'quotations/details',
      element: <QuotationDetail />,
    }
  ]
};

