import React from 'react'
import NavBar from '../../components/NavBar'
import Site_Manager_Profile from '../../components/SiteManager/Site_Manager_Profile'

function SiteManager_Profile() {
  return (
    <>
      <NavBar
        links={[
          { name: "Dashboard", href: "#" },
          { name: "Projects", href: "#" },
          { name: "Materials", href: "#" },
          { name: "Inventory", href: "#" },
          { name: "Purchase Orders", href: "#" },
        ]}
        showButton={true}
    />
    <Site_Manager_Profile />
    </>
  )
}

export default SiteManager_Profile
