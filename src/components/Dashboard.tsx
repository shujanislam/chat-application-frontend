import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileBar from './ProfileBar';
import Chatbox from './Chatbox';
import AddFriends from './AddFriends';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState('');
  const [selectedUserChat, setSelectedUserChat] = useState(null);
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
        setUser(data.user);
        setUserId(data.user_id);
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
    <div className="flex h-screen">
      {/* Left ProfileBar Section */}
      <div className="w-72 bg-slate-800">
        <ProfileBar user={user} userId={userId} setSelectedUserChat={setSelectedUserChat} />
      </div>

      {/* Right Chatbox Section - This takes 100% of the screen height */}
      <div className="flex-1 bg-white p-4 overflow-y-auto h-full">
        <Chatbox user={user} selectedUserChat={selectedUserChat} />
      </div>
    </div>
  );
};

export default Dashboard;
