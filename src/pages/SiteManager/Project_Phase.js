import React from 'react'
import NavBar from '../../components/NavBar'
import Project_Phase_Management from '../../components/SiteManager/Project_Phase_Management'

const Project_Phase = () => {
  return (
    <>
      <NavBar
        profileURL='profile'
        links={[
          { name: "Dashboard", href: "/site-manager" },
          { name: "Projects", href: "/site-manager/projects-list" },
          { name: "Materials", href: "/site-manager/material-request-list" },
          { name: "Inventory", href: "/site-manager/site-inventory" },
          // { name: "Purchase Orders", href: "/site-manager/projects-list" },
        ]}
        // showButton={true}
    />
    <Project_Phase_Management />
    </>
  )
}

export default Project_Phase
