// Admin_Dashboard.jsx

import React from 'react'
import NavBar from '../../components/NavBar'
import ConstructionDashboard from '../../components/Admin/admin-dashboard'

function Admin_Dashboard() {
  return (
    <>
      <NavBar
        links={[
          { name: "Dashboard", href: "/admin", active: true },
          { name: "Supply Chain", href: "/supplychain" },
          { name: "Inventory", href: "/admin-inventory" },
          { name: "Users", href: "/admin-users" },
        ]}
      />
        <ConstructionDashboard />
      {/* </div> */}
    </>
  );
}

export default Admin_Dashboard;
