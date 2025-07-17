import React from 'react'
import NavBar from '../../components/NavBar'
import InventoryDashboard from '../../components/Admin/admin-inventory'

function Admin_Inventory() {
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
    <InventoryDashboard/>
    </>
  )
}

export default Admin_Inventory;
