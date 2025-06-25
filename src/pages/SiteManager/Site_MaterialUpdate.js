import React from 'react'
import NavBar from '../../components/NavBar'
import Site_RawMaterial_Update from '../../components/SiteManager/Site_RawMaterial_Update'

function Site_MaterialUpdate() {
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
    <Site_RawMaterial_Update />
    </>
  )
}

export default Site_MaterialUpdate
