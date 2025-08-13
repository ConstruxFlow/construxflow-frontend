import React from 'react'
import NavBar from '../../components/NavBar'
import Create_ProjectForm from '../../components/SiteManager/Create_ProjectForm'
// import NavBar from '../../components/NavBar'

const Create_Project = () => {
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
    <Create_ProjectForm/>
    </>
  )
}

export default Create_Project
