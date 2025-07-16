// File: src/pages/AddEquipment.js
import React from 'react';
import NavBar from '../../components/NavBar';
import EquipmentForm from '../../components/InventoryManager/EquipmentForm';

const AddEquipment = () => {
 const handleAddEquipment = async (formData) => {
  try {
    const response = await fetch("http://localhost:8080/api/equipment/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log("Saved equipment:", data);
    alert("Equipment added successfully!");
  } catch (error) {
    console.error("Error saving equipment:", error);
    alert("Failed to save equipment");
  }
};

  return (
    <>
      <NavBar 
      links={[
        {name: 'Dashboard', path: '/inventory-dashboard'},
        {name: 'Maintenance', path: '/maintenance-requests-overview'},
        {name: 'Dashboard'},
        {name: 'Dashboard'},
        {name: 'Dashboard'},
      ]}
        />
      <div className="bg-[#FCFCFC] min-h-screen py-8 px-4">
        <h1 className="text-3xl font-bold text-[#236571] text-center mb-6">Add New Equipment</h1>
        <EquipmentForm onSubmit={handleAddEquipment} />
      </div>
    </>
  );
};

export default AddEquipment;
