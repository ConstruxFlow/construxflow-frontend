import React from 'react'
import NavBar from '../../components/NavBar'
import Edit_ProjectForm from '../../components/SiteManager/Edit_ProjectForm'

const Edit_Project = () => {
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
    <Edit_ProjectForm/>
    </>
  )
}

export default Edit_Project
