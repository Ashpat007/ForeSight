// src/components/ui/Input.jsx
import React from 'react';

const Input = ({ className, ...props }) => {
  return (
    <input
      className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
      {...props}
    />
  );
};

export default Input;
