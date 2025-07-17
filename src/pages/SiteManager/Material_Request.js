import React from 'react'
import NavBar from '../../components/NavBar'
import Material_Request_List from '../../components/SiteManager/Material_Request_List'
import { useLocation } from 'react-router-dom';

function Material_Request() {
  const location = useLocation();
  const { project, phase, materials } = location.state || {};
  console.log('Received from navigation:', { project, phase, materials });
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
    <Material_Request_List />
    </>
  )
}

export default Material_Request
