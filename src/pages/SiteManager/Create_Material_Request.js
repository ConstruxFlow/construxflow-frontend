import React from 'react'
import NavBar from '../../components/NavBar'
import Material_Request_Form from '../../components/SiteManager/Material_Request_Form'

function Create_Material_Request() {
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
    <Material_Request_Form />
    </>
  )
}

export default Create_Material_Request
