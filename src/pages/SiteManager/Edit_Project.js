import React from 'react'
import NavBar from '../../components/NavBar'
import Edit_ProjectForm from '../../components/SiteManager/Edit_ProjectForm'

const Edit_Project = () => {
  return (
    <>
    <NavBar
        profileURL='profile'
        links={[
          { name: "Dashboard", href: "/site-manager" },
          { name: "Projects", href: "/site-manager/projects-list" },
          { name: "Materials", href: "/site-manager/material-request-list" },
          { name: "Inventory", href: "/site-manager/site-inventory" },
          { name: "Purchase Orders", href: "/site-manager/order-details" }
          // { name: "Purchase Orders", href: "/site-manager/projects-list" },
        ]}
        // showButton={true}
    />
    <Edit_ProjectForm/>
    </>
  )
}

export default Edit_Project
