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
    <Material_Request_List />
    </>
  )
}

export default Material_Request
