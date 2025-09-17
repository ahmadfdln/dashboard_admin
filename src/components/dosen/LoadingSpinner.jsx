import React from 'react';

const LoadingSpinner = ({ message = 'Memuat data...' }) => (
  <div className="flex justify-center items-center h-96">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 font-medium">{message}</p>
    </div>
  </div>
);

export default LoadingSpinner;
