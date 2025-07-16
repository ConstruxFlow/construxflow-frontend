import React from 'react'
import NavBar from '../../components/NavBar'
import UserDashboard from '../../components/Admin/admin-users'

function Admin_Users() {
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
    <UserDashboard />
    </>
  )
}

export default Admin_Users;
