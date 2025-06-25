import React from 'react'
import NavBar from '../../components/NavBar'
import Create_ProjectForm from '../../components/SiteManager/Create_ProjectForm'
// import NavBar from '../../components/NavBar'

const Create_Project = () => {
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
    <Create_ProjectForm/>
    </>
  )
}

export default Create_Project
