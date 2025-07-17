import React from 'react'
import NavBar from '../../components/NavBar'
import AnalyticsReports from '../../components/Admin/admin-analysis';

function Admin_Analysis() {
  return (
    <>
      <NavBar
        links={[
          { name: "Dashboard", href: "#" },
          { name: "Supply Chain", href: "#" },
          { name: "Inventory", href: "#" },
          { name: "Insights", href: "#" },
          { name: "Users", href: "#" },
          { name: "Settings", href: "#" },
        ]}
        showButton={true}
    />
    <AnalyticsReports/>
    </>
  )
}

export default Admin_Analysis;
