// src/pages/inventorymanager/AddMaterial.js
import React from 'react';
import NavBar from '../../components/NavBar';
import AddMaterialForm from '../../components/InventoryManager/AddMaterialForm';

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
    <>
      <NavBar
        links={[
        {name: 'Dashboard', path: '/inventory-dashboard'},
        {name: 'Inventory Control', path: '/inventory-control'},
        {name: 'Inventory Monitoring', path: '/inventory-monitoring'},
        {name: 'Maintenance Requests', path: '/maintenance-requests-overview'},
        {name: 'Equipment Sheduling', path: '/equipment-scheduling'},
        
     ]}
      />
      <div className="bg-[#FCFCFC] min-h-screen py-8 px-4">
        <h1 className="text-3xl font-bold text-[#236571] text-center mb-6">Add New Inventory Material</h1>
        <AddMaterialForm onSubmit={handleAddMaterial} />
      </div>
    </>
  );
};

export default AddMaterial;
