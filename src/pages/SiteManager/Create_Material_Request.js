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
        links={[
          { name: "Dashboard", href: "#" },
          { name: "Projects", href: "#" },
          { name: "Materials", href: "#" },
          { name: "Inventory", href: "#" },
          { name: "Purchase Orders", href: "#" },
        ]}
        showButton={true}
      />
      <Material_Request_Form project={project} phase={phase} materials={materials} />
    </>
  )
}

export default Create_Material_Request
