// Admin_Dashboard.jsx

import React from 'react'
import NavBar from '../../components/NavBar'
import ConstructionDashboard from '../../components/Admin/admin-dashboard'

function Admin_Dashboard() {
  return (
    <>
      <NavBar
        links={[
          { name: "Dashboard", href: "/dashboard1", active: true },
          { name: "Supply Chain", href: "/supplychain" },
          { name: "Inventory", href: "/inventory" },
          { name: "Insights", href: "/insights" },
          { name: "Users", href: "/users" },
          { name: "Settings", href: "/settings" },
        ]}
      />
        <ConstructionDashboard />
      {/* </div> */}
    </>
  );
}

export default Admin_Dashboard;
