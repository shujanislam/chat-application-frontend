import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

const ProfileSettings = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/logout', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok || response.redirected) {
        localStorage.removeItem('status');
        navigate('/');
      } else {
        setError('Error logging out');
      }
    } catch (err) {
      setError('Error logging out: ' + err.message);
      console.error('Logout error:', err);
    }
  };

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return(
    <div className="relative inline-block text-left">
      {/* Settings Button */}
      <button
        onClick={toggleDropdown}
        className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Cog6ToothIcon className="h-6 w-6 text-white" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <button
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              onClick={() => console.log('Profile clicked')}
            >
              Profile
            </button>
            <button
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              onClick={() => console.log('Settings clicked')}
            >
              Settings
            </button>
            <button
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              onClick={handleLogOut}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileSettings;
