import { useState } from 'react';
import { validateDeliverySchedule, validateMaterials, validateQuantitySplit, validateRequestData } from './Validation';
import { showValidationErrors } from '../../../../components/errorHandle';

export const useFormValidation = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (requestData, materials, deliverySchedule) => {
    const requestErrors = validateRequestData(requestData);
    const materialErrors = validateMaterials(materials);
    const deliveryErrors = validateDeliverySchedule(deliverySchedule);
    const quantityErrors = validateQuantitySplit(materials, deliverySchedule);

    const allErrors = [
      ...requestErrors,
      ...materialErrors,
      ...deliveryErrors,
      ...quantityErrors
    ];

    return showValidationErrors(allErrors);
  };

  const validateField = (fieldName, value, additionalData = {}) => {
    const errors = [];

    switch (fieldName) {
      case 'requesterName':
        if (!value?.trim()) {
          errors.push('Requester name is required');
        }
        break;
      
      case 'request_date':
        if (!value) {
          errors.push('Request date is required');
        }
        break;
      
      case 'quotation_deadline':
        if (!value) {
          errors.push('Quotation deadline is required');
        } else if (additionalData.request_date) {
          const requestDate = new Date(additionalData.request_date);
          const deadlineDate = new Date(value);
          if (deadlineDate <= requestDate) {
            errors.push('Quotation deadline must be after request date');
          }
        }
        break;
      
      case 'priority_level':
        if (!value) {
          errors.push('Priority level is required');
        }
        break;
      
      case 'quotation_type':
        if (!value) {
          errors.push('Request type is required');
        }
        break;
      
      default:
        break;
    }

    return errors;
  };

  return {
    validateForm,
    validateField,
    isSubmitting,
    setIsSubmitting
  };
};
