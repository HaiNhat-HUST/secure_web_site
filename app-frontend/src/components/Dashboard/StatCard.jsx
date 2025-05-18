import React from 'react';

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 text-center">
      {icon && <div className="text-4xl mb-2 text-indigo-600">{icon}</div>}
      <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default StatCard;