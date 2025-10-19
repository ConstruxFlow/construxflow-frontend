import { Outlet } from "react-router-dom";
import AdvancePaymentApproval from "./AdvancePaymentApproval";
import FinanceSupplierDetail from "./FinanceSupplierDetails";
import PoListView from "./PoListView";
import PoDetails from "./PoDetails";
import PaymentList from "./PaymentList";
import FinancialOfficerDashboard from "./FinancialOfficerDashboard";
import FinancialProjectsList from "./FinancialProjectsList";
import FinancialProjectDetails from "./FinancialProjectDetails";
import ManagerProfileView from "./ManagerProfile";
import FullPaymentCompletion from "./FullPaymentCompletion";

export const FinanceManagerRoutes = {
  path: "/financial",
  element: <Outlet />,
  children: [
    {
        path: "dashboard",
        element: <FinancialOfficerDashboard />,
    },
    {
      path: "advance-payment-approval/:poId",
      element: <AdvancePaymentApproval />,
    },
    {
      path: "supplier-details",
      element: <FinanceSupplierDetail />,
    },
    {
      path: "purchase-order-list",
      element: <PoListView />,
    },
    {
      path: "purchase-order-details/:id",
      element: <PoDetails />,
    },
    {
      path: "payment-list",
      element: <PaymentList />,
    },
    {
        path: "financial-projects",
        element: <FinancialProjectsList />,
    },
    {
      path: "financial-project-details/:projectId",
      element: <FinancialProjectDetails />,
    },
    {
      path: "full-payment-completion/:poId",
      element: <FullPaymentCompletion />,
    },
    {
      path: "profile",
      element: <ManagerProfileView />,
    }
  ],
};
