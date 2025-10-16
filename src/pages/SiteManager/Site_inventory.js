import React from 'react'
import NavBar from '../../components/NavBar'
import SiteInventory from '../../components/SiteManager/site_inventory'

function Site_inventory() {
  return (
    <>
      <NavBar
        profileURL='profile'
        links={[
          { name: "Dashboard", href: "/site-manager" },
          { name: "Projects", href: "/site-manager/projects-list" },
          { name: "Materials", href: "/site-manager/material-request-list" },
          { name: "Inventory", href: "/site-manager/site-inventory" },
          // { name: "Purchase Orders", href: "/site-manager/projects-list" },
        ]}
        // showButton={true}
    />
    <SiteInventory />
    </>
  )
}

export default Site_inventory
