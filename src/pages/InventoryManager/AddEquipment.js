// File: src/pages/AddEquipment.js
import React from 'react';
import NavBar from '../../components/NavBar';
import EquipmentForm from '../../components/InventoryManager/EquipmentForm';

const AddEquipment = () => {
  const handleAddEquipment = (formData) => {
    console.log('Submitted Equipment:', formData);
    // You can add API POST call here later
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
