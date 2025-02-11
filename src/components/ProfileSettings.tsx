import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import StatusMenu from './StatusMenu'; // Import the new StatusMenu component

const ProfileSettings = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleStatusMenu = () => setIsStatusOpen(!isStatusOpen);

  const handleLogOut = async () => {
    try {
      const response = await fetch(`http://localhost:8000/auth/logout/${user}`, {
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

  return (
    <div className="relative">
      {/* Settings Button */}
      <button
        onClick={toggleDropdown}
        className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Cog6ToothIcon className="h-6 w-6 text-white" />
      </button>

      {/* Main Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-0 right-0 translate-x-2 transform -translate-y-full bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 w-48">
          <div className="py-1">
            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
              Profile
            </button>
            <button
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              onClick={toggleStatusMenu}
            >
              Status
            </button>
            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
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

      {/* Status Menu (Appears when clicking "Status") */}
      {isStatusOpen && <StatusMenu onClose={() => setIsStatusOpen(false)} user={user} />}
    </div>
  );
};

export default ProfileSettings;
