import React from 'react'
import NavBar from '../../components/NavBar'
import ExistingProjects from '../../components/SiteManager/ExistingProjects'

const Existing_Projects = () => {
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
    <Existing_Projects/>
    </>
  )
}

export default Existing_Projects
