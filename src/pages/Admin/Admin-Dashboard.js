// Admin_Dashboard.jsx

import React from 'react'
import NavBar from '../../components/NavBar'
import ConstructionDashboard from '../../components/Admin/admin-dashboard'

function Admin_Dashboard() {
  return (
    <>
      <NavBar
       profileURL='/admin/profile'
        links={[
          { name: "Dashboard", href: "/admin", active: true },
          { name: "Projects", href: "/admin/projects-list" },
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
