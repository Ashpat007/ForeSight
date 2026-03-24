// src/components/ui/Button.jsx
import React from 'react';

const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={`py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
