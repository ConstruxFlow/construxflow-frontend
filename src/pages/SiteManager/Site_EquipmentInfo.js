import React from 'react'
import NavBar from '../../components/NavBar'
import Site_Equipment_Info from '../../components/SiteManager/Site_Equipment_Info'

function Site_EquipmentInfo() {
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
    <Site_Equipment_Info />
    </>
  )
}

export default Site_EquipmentInfo
