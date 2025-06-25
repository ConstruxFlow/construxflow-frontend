import React from 'react'
import NavBar from '../../components/NavBar'
import Material_Request_List from '../../components/SiteManager/Material_Request_List'

function Material_Request() {
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
    <Material_Request_List />
    </>
  )
}

export default Material_Request
