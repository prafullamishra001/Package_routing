import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/parcel-routing')}
              className="px-3 py-2 rounded hover:bg-blue-700 transition"
            >
              Route Parcel
            </button>
            <button
              onClick={() => navigate('/batch-upload')}
              className="px-3 py-2 rounded hover:bg-blue-700 transition"
            >
              Batch Upload
            </button>
            <button
              onClick={() => navigate('/routing-history')}
              className="px-3 py-2 rounded hover:bg-blue-700 transition"
            >
              History
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-blue-700 rounded hover:bg-blue-800 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
