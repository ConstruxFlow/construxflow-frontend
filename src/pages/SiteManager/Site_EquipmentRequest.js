import React from 'react'
import NavBar from '../../components/NavBar'
import Site_Equipment_Request from '../../components/SiteManager/Site_Equipment_Request'

function Site_EquipmentRequest() {
  return (
    <>
      <NavBar
        profileURL='profile'
        links={[
          { name: "Dashboard", href: "/site-manager" },
          { name: "Projects", href: "/site-manager/projects-list" },
          { name: "Materials", href: "/site-manager/material-request-list" },
          { name: "Inventory", href: "/site-manager/site-inventory" },
          { name: "Purchase Orders", href: "/site-manager/order-details" }
          // { name: "Purchase Orders", href: "/site-manager/projects-list" },
        ]}
        // showButton={true}
    />
    <Site_Equipment_Request />
    </>
  )
}

export default Site_EquipmentRequest
