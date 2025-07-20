import { Outlet } from "react-router-dom";
import SupplierDashboard from "./SupplierDashboard";
import MaterialRequests from "./MaterialRequests";
import RequestDetails from "./RequestDetails";
import SubmitQuotation from "./SubmitQuotation";
import QuotationStatus from "./QuotationStatus";
import QuotationDetails from "./QuotationDetails";
import ReceiveAdvancedPayment from "./ReceiveAdvancedPayment";
import ReceiveFullPayment from "./ReceiveFullPayment";
import UpdateQuotation from "./UpdateQuotation";
import PurchasingOrders from "./PurchasingOrders";
import OrderDetails from "./OrderDetails";
import PaymentStatus from "./PaymentStatus";
import ContactSupport from "./ContactSupport";
import Profile from "./Profile";
import EditProfile from "./EditProfile";

export const SupplierRoutes = {
  path: "/supplier",
  element: <Outlet />,
  children: [
    {
      path: "dashboard",
      element: <SupplierDashboard />,
    },
    {
      path: "requests",
      element: <MaterialRequests />,
    },
    {
      path: "requests/:id",
      element: <RequestDetails />,
    },
    { path: "quotations/submit/:id", element: <SubmitQuotation /> },
    { path: "quotations", element: <QuotationStatus /> },
    { path: "quotations/:id", element: <QuotationDetails /> },
    { path: "payments/receive-advanced", element: <ReceiveAdvancedPayment /> },
    { path: "payments/receive-full", element: <ReceiveFullPayment /> },
    { path: "quotations/update/:id", element: <UpdateQuotation /> },

    {
      path: "orders",
      element: <PurchasingOrders />,
    },
    {
      path: "orders/:id",
      element: <OrderDetails />,
    },
    { path: "payments", element: <PaymentStatus /> },
    { path: "profile", element: <Profile/> },
    { path: "profile/edit", element: <EditProfile /> },
    { path: "contact-support", element: <ContactSupport /> },
  ],
};
