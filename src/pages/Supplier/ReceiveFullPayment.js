// src/pages/Supplier/ReceiveFullPayment.jsx
import React from "react";
import NavBar from "../../components/NavBar";

const navLinks = [
  { name: "Dashboard", href: "/dashboard1" },
  { name: "Requests", href: "/requests" },
  { name: "Quotations", href: "/quotations" },
  { name: "Orders", href: "/orders" },
  { name: "Payments", href: "/payments", active: true },
];

const payment = {
  reference: "PAY-2024-00124",
  orderId: "ORD-2024-5678",
  project: "Downtown Office Complex - Phase 2",
  date: "December 18, 2024",
  amount: 120000,
  status: "Fully Paid",
  bank: "First National Bank",
  accountEnding: "****3921",
  transferMethod: "Wire Transfer",
  transactionId: "TRN#845969213",
  instructions:
    "This payment covers 100% of Order ORD-2024-5678 for construction materials delivery. Please confirm receipt within 24 hours. Contact support if you have any issues.",
};

const statusBadge = {
  "Fully Paid": "bg-deep_green text-purewhite",
  Pending: "bg-slatebluegray text-purewhite",
};

const ReceiveFullPayment = () => (
  <div className="bg-purewhite min-h-screen font-poppins">
    <NavBar links={navLinks} logoSrc="/logo1.png" />

    <div className="max-w-full mx-auto px-16 py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-main_dark mb-2">
        Receive Full Payment
      </h1>
      <p className="text-gray-500 mb-8">
        Review and confirm receipt of your full payment.
      </p>

      {/* Payment Summary Card */}
      <div className="bg-gray-200 rounded-xl p-7 mb-7 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="flex-1">
          <div className="mb-2">
            <span className="text-sm text-slatebluegray">Payment Reference</span>
            <div className="font-bold text-deep_green text-base underline cursor-pointer">{payment.reference}</div>
          </div>
          <div className="mb-2">
            <span className="text-sm text-slatebluegray">Order</span>
            <div className="font-bold text-main_dark">{payment.orderId}</div>
          </div>
          <div className="mb-2">
            <span className="text-sm text-slatebluegray">Project Name</span>
            <div className="font-bold text-deep_green underline cursor-pointer">{payment.project}</div>
          </div>
          <div className="mb-2">
            <span className="text-sm text-slatebluegray">Payment Date</span>
            <div className="font-medium text-main_dark">{payment.date}</div>
          </div>
        </div>
        <div className="flex flex-col items-end min-w-[220px]">
          <div className="text-sm text-slatebluegray mb-1">Amount Received</div>
          <div className="text-3xl font-extrabold text-yellow-500 mb-2">
            ${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge[payment.status]}`}>
            {payment.status}
          </span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-purewhite border border-light_gray rounded-xl p-6 mb-6">
        <div className="font-semibold text-main_dark mb-3">Payment Method</div>
        <div className="grid grid-cols-2 gap-4 text-main_dark text-sm">
          <div>
            <div className="text-slatebluegray">Bank Name</div>
            <div className="font-medium">{payment.bank}</div>
          </div>
          <div>
            <div className="text-slatebluegray">Transfer Method</div>
            <div className="font-medium">{payment.transferMethod}</div>
          </div>
          <div>
            <div className="text-slatebluegray">Account Ending</div>
            <div className="font-medium">{payment.accountEnding}</div>
          </div>
          <div>
            <div className="text-slatebluegray">Transaction ID</div>
            <div className="font-medium">{payment.transactionId}</div>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="bg-light_gray rounded-xl p-6 mb-8">
        <div className="font-semibold text-main_dark mb-2">Payment Instructions</div>
        <div className="text-main_dark text-sm">{payment.instructions}</div>
      </div>

      {/* Confirm Button & Help */}
      <div className="flex flex-col items-center gap-3 mb-16">
        <button className="bg-web_yellow text-main_dark font-semibold px-8 py-3 rounded-lg shadow hover:opacity-90 transition text-lg">
          &#10003; Confirm Receipt
        </button>
        <a href="#" className="flex items-center gap-2 text-slatebluegray text-sm hover:underline mt-1">
          <span className="inline-block w-3 h-3 rounded-full bg-slatebluegray" />
          Need help with payment issues?
        </a>
      </div>
    </div>

    {/* Footer */}
    <footer className="bg-main_dark text-purewhite px-8 py-8 mt-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="font-bold mb-2 flex items-center gap-2">
            <span className="bg-web_yellow w-6 h-6 rounded flex items-center justify-center text-main_dark font-bold text-lg">P</span>
            PaymentPro
          </div>
          <div className="text-light_gray">Streamline your payment processes with our comprehensive solution.</div>
        </div>
        <div>
          <div className="font-semibold mb-2">Services</div>
          <div className="text-light_gray space-y-1">
            <div>Payment Processing</div>
            <div>Invoice Management</div>
            <div>Reporting</div>
          </div>
        </div>
        <div>
          <div className="font-semibold mb-2">Support</div>
          <div className="text-light_gray space-y-1">
            <div>Help Center</div>
            <div>Contact Us</div>
            <div>Documentation</div>
          </div>
        </div>
        <div>
          <div className="font-semibold mb-2">Connect</div>
          <div className="text-light_gray space-y-1 flex gap-2">
            <span> {/* Social icons can go here */} </span>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-light_gray mt-8">
        © 2024 PaymentPro. All rights reserved.
      </div>
    </footer>
  </div>
);

export default ReceiveFullPayment;
