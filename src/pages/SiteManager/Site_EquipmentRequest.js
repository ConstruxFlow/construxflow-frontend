import React from 'react'
import NavBar from '../../components/NavBar'
import Site_Equipment_Request from '../../components/SiteManager/Site_Equipment_Request'

function Site_EquipmentRequest() {
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
    <Site_Equipment_Request />
    </>
  )
}

export default Site_EquipmentRequest
