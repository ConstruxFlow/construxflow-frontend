import React from 'react'
import NavBar from '../../components/NavBar'
import Project_Phase_Management from '../../components/SiteManager/Project_Phase_Management'

const Project_Phase = () => {
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
    <Project_Phase_Management />
    </>
  )
}

export default Project_Phase
