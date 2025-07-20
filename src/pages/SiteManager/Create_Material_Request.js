import React from 'react'
import NavBar from '../../components/NavBar'
import Material_Request_Form from '../../components/SiteManager/Material_Request_Form'
import { useLocation } from 'react-router-dom';

function Create_Material_Request() {
  const location = useLocation();
  const { project, phase, materials } = location.state || {};
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
      <Material_Request_Form project={project} phase={phase} materials={materials} />
    </>
  )
}

export default Create_Material_Request
