import React from 'react'
import NavBar from '../../components/NavBar'
import Create_Purchase_Order from '../../components/SiteManager/Create_Purchase_Order'

function Purchase_Order() {
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
    <Create_Purchase_Order />
    </>
  )
}

export default Purchase_Order
