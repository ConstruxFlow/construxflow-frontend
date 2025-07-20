import React from 'react'
import NavBar from '../../components/NavBar'
import UserDashboard from '../../components/Admin/admin-users'

function Admin_Users() {
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
    <UserDashboard />
    </>
  )
}

export default Admin_Users;
