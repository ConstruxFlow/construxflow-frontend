import React from 'react'
function DiagonalLines({
  width = 126,
  height = 39,
  lineCount = 13,
  lineSpacing = 10,
  lineLength = 72.25,
  rotation = -60,
  color = "white",
  opacity = 1,
  strokeWidth = 1,
  pattern = 'solid',
  startPosition = { x: -11.52, y: 44.83 },
  className = ""
}) {
  const getOutlineStyle = () => {
    const baseStyle = `outline-${strokeWidth} outline-offset-[-0.50px]`;
    
    switch (pattern) {
      case 'dashed':
        return `${baseStyle} outline-dashed`;
      case 'dotted':
        return `${baseStyle} outline-dotted`;
      default:
        return `${baseStyle} outline`;
    }
  };

  return (
    <div 
      className={`relative bg-white/0 rounded-lg overflow-hidden ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {Array.from({ length: lineCount }, (_, index) => (
        <div
          key={index}
          className={`h-0 absolute origin-top-left ${getOutlineStyle()}`}
          style={{
            width: `${lineLength}px`,
            left: `${startPosition.x + (index * lineSpacing)}px`,
            top: `${startPosition.y}px`,
            transform: `rotate(${rotation}deg)`,
            outlineColor: color,
            opacity: opacity
          }}
        />
      ))}
    </div>
  );
}
export default DiagonalLines;