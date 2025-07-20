import React from 'react'
import NavBar from '../../components/NavBar'
import ExistingProjects from '../../components/SiteManager/ExistingProjects'

function Existing_Projects_List() {
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
    />
    <ExistingProjects />
    </>
  )
}

export default Existing_Projects_List
