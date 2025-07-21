export const generateNextSupplierId = (currentId) => {
    // Extract the prefix (S) and numeric part (002)
    const prefix = currentId.match(/[A-Za-z]+/)[0]; // Gets "S"
    const numericPart = currentId.match(/\d+/)[0]; // Gets "002"

    // Convert to number, increment, and pad with zeros
    const nextNumber = parseInt(numericPart) + 1;
    const paddedNumber = nextNumber
      .toString()
      .padStart(numericPart.length, "0");

    // Return the new ID
    return `${prefix}${paddedNumber}`;
  };

