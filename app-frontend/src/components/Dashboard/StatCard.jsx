import React from 'react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon, linkTo, description, iconBgColor = 'bg-indigo-100', iconTextColor = 'text-indigo-600' }) => {
  const cardContent = (
    <div className={`bg-white shadow-xl rounded-lg p-5 hover:shadow-2xl transition-shadow duration-300 ease-in-out flex items-center space-x-4 ${linkTo ? 'cursor-pointer transform hover:-translate-y-1' : ''}`}>
      {icon && (
        <div className={`p-3 rounded-full ${iconBgColor}`}>
          <span className={`text-3xl ${iconTextColor}`}>{icon}</span>
        </div>
      )}
      <div>
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="block no-underline">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default StatCard;