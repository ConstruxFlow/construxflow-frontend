import React from 'react'
import NavBar from '../../components/NavBar'
import ExistingProjects from '../../components/SiteManager/ExistingProjects'

function Existing_Projects_List() {
  return (
    <>
      <NavBar
        profileURL='profile'
        links={[
          { name: "Dashboard", href: "/site-manager" },
          { name: "Projects", href: "/site-manager/projects-list" },
          { name: "Materials", href: "/site-manager/material-request-list" },
          { name: "Inventory", href: "/site-manager/site-material-info" },
          // { name: "Purchase Orders", href: "/site-manager/projects-list" },
        ]}
        // showButton={true}
    />
    <ExistingProjects />
    </>
  )
}

export default Existing_Projects_List
