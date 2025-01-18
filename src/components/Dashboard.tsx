import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileBar from './ProfileBar';
import Users from './Users';
import Chatbox from './Chatbox';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:8000/auth/user', {
          credentials: 'include',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const data = await response.json();
        setUser(data); // Assume `data` includes the user object with `name` property.
        localStorage.setItem('status', 'active');
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
        navigate('/');
      }
    };

    fetchUser();
  }, [navigate]);

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (!user) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <>
      <ProfileBar user={user} />
      <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
        <Users onUserSelect={setSelectedUser} user={user.name} />
        <Chatbox selectedUserChat={selectedUser} user={user} />
      </div>
    </div>

    </>
  );
};

export default Dashboard;

