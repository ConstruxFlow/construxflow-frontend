import React from 'react'
import NavBar from '../../components/NavBar'
import Site_RawMaterial_Add from '../../components/SiteManager/Site_RawMaterial_Add'

function Site_MaterialAdd() {
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
    <Site_RawMaterial_Add />
    </>
  )
}

export default Site_MaterialAdd
