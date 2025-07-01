import React from 'react'
import NavBar from '../../components/NavBar'
import Site_RawMaterial_Info from '../../components/SiteManager/Site_RawMaterial_Info'

function Site_MaterialInfo() {
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
    <Site_RawMaterial_Info />
    </>
  )
}

export default Site_MaterialInfo
