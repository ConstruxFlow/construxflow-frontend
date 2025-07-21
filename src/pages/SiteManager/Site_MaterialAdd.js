import React from 'react'
import NavBar from '../../components/NavBar'
import Site_RawMaterial_Add from '../../components/SiteManager/Site_RawMaterial_Add'

function Site_MaterialAdd() {
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
    <Site_RawMaterial_Add />
    </>
  )
}

export default Site_MaterialAdd
