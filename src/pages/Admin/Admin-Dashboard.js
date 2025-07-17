import React from 'react'
import NavBar from '../../components/NavBar'
import ConstructionDashboard from '../../components/Admin/admin-dashboard'

function Admin_Dashboard() {
  return (
    <>
      <NavBar
        links={[
          { name: "Dashboard", href: "#" },
          { name: "Supply Chain", href: "#" },
          { name: "Inventory", href: "#" },
          { name: "Insights", href: "#" },
          { name: "Users", href: "#" },
          { name: "Settings", href: "#" },
        ]}
        showButton={true}
    />
    <ConstructionDashboard/>
    </>
  )
}

export default Admin_Dashboard;
