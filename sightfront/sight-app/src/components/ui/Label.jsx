// src/components/ui/Label.jsx
import React from 'react';

const Label = ({ children, className, ...props }) => {
  return (
    <label
      className={`block text-gray-700 dark:text-gray-300 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

export default Label;
