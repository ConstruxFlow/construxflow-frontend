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
import SupplierDetail from "./Suppliers/SupplierDetails";
import QuotationRequestsOverview from "./Material_Requests/QuotationRequestsOverview ";
import QuotationRequestDetail from "./Material_Requests/QuotationRequestDetail";
import BestQuotationsList from "./Quotations/BestQuotationsList ";
import CreatePurchaseOrder from "./PurchasingOrder/CreatePurchaseOrder";
import RequestAdvancePayment from "./PurchasingOrder/RequestAdvancePayment";
import PurchaseOrdersOverview from "./PurchasingOrder/PurchaseOrdersOverview";
import PurchaseOrderDetails from "./PurchasingOrder/PurchaseOrderDetails";
import EditQuotationRequest from "./Material_Requests/EditQuotationRequest";
import EditPurchaseOrder from "./PurchasingOrder/EditPurchaseOrder";

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
      path: 'materialrequests/details/pwise/:id',
      element: <MaterialReqDetails />,
    },
    {
      path: 'materialrequests/details/mwise',
      element: <MaterialReqDetails_MWise />,
    },
    {
      path: 'materialrequests/create',
      element: <CreateMaterialRequest />,
    },
    {
      path: 'quotationrequest/overview',
      element: <QuotationRequestsOverview />,
    },
    {
      path: 'quotationrequest/details/:id',
      element: <QuotationRequestDetail />,
    },
    {
      path: 'quotationrequest/edit/:id',
      element: <EditQuotationRequest />,
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
      path: 'supplier/details',
      element: <SupplierDetail />,
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
      path: 'quotations/details/:id',
      element: <QuotationDetail />,
    },
    {
      path: 'quotations/best',
      element: <BestQuotationsList />,
    },
    {
      path: 'orders/create',
      element: <CreatePurchaseOrder />,
    },
    {
      path: 'orders/advance-payment',
      element: <RequestAdvancePayment />,
    },
    {
      path: 'orders/overview',
      element: <PurchaseOrdersOverview />,
    },
    {
      path: 'orders/details/:id',
      element: <PurchaseOrderDetails />,
    },
    {
      path: 'orders/edit/:id',
      element: <EditPurchaseOrder />,
    }
  ]
};

