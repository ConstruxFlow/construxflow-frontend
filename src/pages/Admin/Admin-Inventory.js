import React from 'react'
import NavBar from '../../components/NavBar'
import InventoryDashboard from '../../components/Admin/admin-inventory'

function Admin_Inventory() {
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
    <InventoryDashboard/>
    </>
  )
}


export default Admin_Inventory;
