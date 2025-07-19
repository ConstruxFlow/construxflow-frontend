import React from 'react'
import NavBar from '../../components/NavBar'
import InventoryDashboard from '../../components/Admin/admin-inventory'

function Admin_Inventory() {
  return (
    <>
      <NavBar
        links={[
          { name: "Dashboard", href: "/admin", active: true },
          { name: "Supply Chain", href: "/supplychain" },
          { name: "Inventory", href: "/admin-inventory" },
          { name: "Users", href: "/admin-users" },
        ]}
        showButton={true}
    />
    <InventoryDashboard/>
    </>
  )
}


export default Admin_Inventory;
