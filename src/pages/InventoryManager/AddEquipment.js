import React from 'react';
import NavBar from '../../components/NavBar';
import EquipmentForm from '../../components/InventoryManager/EquipmentForm';

const navLinks = [
  { name: 'Dashboard', href: '/inventory-dashboard' },
  { name: 'Inventory Control', href: '/inventory-control' },
  { name: 'Inventory Monitoring', href: '/inventory-monitoring' },
  { name: 'Maintenance Requests', href: '/maintenance-requests-overview' },
  { name: 'Equipment Scheduling', href: '/equipment-scheduling' },
];

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
    <div className="bg-purewhite min-h-screen">
      <NavBar 
        links={navLinks}
        logoSrc="/logo1.png"
      />
      <EquipmentForm onSubmit={handleAddEquipment} />
    </div>
  );
};

export default AddEquipment;
