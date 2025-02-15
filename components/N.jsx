import React from 'react';

const Notification = ({ message, type }) => {
  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-[60] ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white animate-fade-in`}>
      <div className="flex items-center justify-between">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Notification;