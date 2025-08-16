import React from 'react'
import NavBar from '../../components/NavBar'
import Site_Equipment_Info from '../../components/SiteManager/Site_Equipment_Info'

function Site_EquipmentInfo() {
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
    <Site_Equipment_Info />
    </>
  )
}

export default Site_EquipmentInfo
