import React from 'react'
import NavBar from '../../components/NavBar'
import Site_RawMaterial_Update from '../../components/SiteManager/Site_RawMaterial_Update'

function Site_MaterialUpdate() {
  return (
    <>
      <NavBar
        profileURL='profile'
        links={[
          { name: "Dashboard", href: "/site-manager" },
          { name: "Projects", href: "/site-manager/projects-list" },
          { name: "Materials", href: "/site-manager/material-request-list" },
          { name: "Inventory", href: "/site-manager/site-material-info" },
          // { name: "Purchase Orders", href: "/site-manager/projects-list" },
        ]}
        // showButton={true}
    />
    <Site_RawMaterial_Update />
    </>
  )
}

export default Site_MaterialUpdate
