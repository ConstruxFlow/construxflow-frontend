import React from 'react'
import NavBar from '../../components/NavBar'
import UserDashboard from '../../components/Admin/admin-users'

function Admin_Users() {
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
    <UserDashboard />
    </>
  )
}

export default Admin_Users;
