
export const validateRequestData = (requestData) => {
  const errors = [];

  // Basic request information validation
  if (!requestData.requesterName?.trim()) {
    errors.push('Requester name is required');
  }

  if (!requestData.request_date) {
    errors.push('Request date is required');
  }

  if (!requestData.quotation_deadline) {
    errors.push('Quotation deadline is required');
  }

  if (!requestData.priority_level) {
    errors.push('Priority level is required');
  }

  if (!requestData.quotation_type) {
    errors.push('Request type is required');
  }

  // Date validation
  if (requestData.request_date && requestData.quotation_deadline) {
    const requestDate = new Date(requestData.request_date);
    const deadlineDate = new Date(requestData.quotation_deadline);
    
    if (deadlineDate <= requestDate) {
      errors.push('Quotation deadline must be after request date');
    }
  }

  return errors;
};

export const validateMaterials = (materials) => {
  const errors = [];

  if (!materials || materials.length === 0) {
    errors.push('At least one material is required');
    return errors;
  }

  const validMaterials = materials.filter(material => 
    material.material.material_id !== null && material.quantity
  );

  if (validMaterials.length === 0) {
    errors.push('Please select at least one material with quantity');
  }

  materials.forEach((material, index) => {
    if (material.material.material_id !== null || material.quantity) {
      if (!material.material.material_id) {
        errors.push(`Material ${index + 1}: Please select a material`);
      }
      
      if (!material.quantity || material.quantity <= 0) {
        errors.push(`Material ${index + 1}: Quantity must be greater than 0`);
      }
    }
  });

  return errors;
};

export const validateDeliverySchedule = (deliverySchedule) => {
  const errors = [];

  if (!deliverySchedule || deliverySchedule.length === 0) {
    errors.push('At least one delivery location is required');
    return errors;
  }

  const validDeliveries = deliverySchedule.filter(item => 
    item.location && item.deliveryDate
  );

  if (validDeliveries.length === 0) {
    errors.push('Please add at least one delivery location with date');
  }

  deliverySchedule.forEach((item, index) => {
    if (item.location || item.deliveryDate || item.quantitySplit) {
      if (!item.location) {
        errors.push(`Delivery ${index + 1}: Please select a location`);
      }
      
      if (!item.deliveryDate) {
        errors.push(`Delivery ${index + 1}: Please select a delivery date`);
      }
      
      if (!item.quantitySplit || item.quantitySplit <= 0) {
        errors.push(`Delivery ${index + 1}: Quantity split must be greater than 0`);
      }

      // Validate delivery date is not in the past
      if (item.deliveryDate) {
        const deliveryDate = new Date(item.deliveryDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (deliveryDate < today) {
          errors.push(`Delivery ${index + 1}: Delivery date cannot be in the past`);
        }
      }
    }
  });

  return errors;
};

export const validateQuantitySplit = (materials, deliverySchedule) => {
  const errors = [];
  
  // Calculate total quantity for each material
  const materialTotals = materials
    .filter(material => material.material.material_id !== null && material.quantity)
    .reduce((acc, material) => {
      acc[material.material.material_id] = (acc[material.material.material_id] || 0) + parseFloat(material.quantity);
      return acc;
    }, {});

  // Calculate total quantity split
  const totalQuantitySplit = deliverySchedule
    .filter(item => item.location && item.deliveryDate && item.quantitySplit)
    .reduce((total, item) => total + parseFloat(item.quantitySplit), 0);

  const totalMaterialQuantity = Object.values(materialTotals).reduce((sum, qty) => sum + qty, 0);

  if (totalQuantitySplit > totalMaterialQuantity) {
    errors.push('Total quantity split cannot exceed total material quantity');
  }

  return errors;
};
