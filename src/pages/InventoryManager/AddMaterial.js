import React from 'react';
import NavBar from '../../components/NavBar';
import AddMaterialForm from '../../components/InventoryManager/AddMaterialForm';

const navLinks = [
  { name: 'Dashboard', href: '/inventory-dashboard' },
  { name: 'Inventory Control', href: '/inventory-control' },
  { name: 'Inventory Monitoring', href: '/inventory-monitoring' },
  { name: 'Maintenance Requests', href: '/maintenance-requests-overview' },
  { name: 'Equipment Scheduling', href: '/equipment-scheduling' },
];

const AddMaterial = () => {
  const handleAddMaterial = async (formData) => {
    try {
      const response = await fetch("http://localhost:8080/api/inventory/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Saved material:", data);
      alert("Material added successfully!");
    } catch (error) {
      console.error("Error saving material:", error);
      alert("Failed to save material");
    }
  };

  return (
    <div className="bg-purewhite min-h-screen">
      <NavBar
        links={navLinks}
        logoSrc="/logo1.png"
      />
      <AddMaterialForm onSubmit={handleAddMaterial} />
    </div>
  );
};

export default AddMaterial;
