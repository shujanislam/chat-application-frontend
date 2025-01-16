import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:8000/auth/user', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('User data:', data);
          setUser(data);
        } else {
          const errorText = await response.text();
          setError(errorText);
          navigate('/');
          console.log('Authentication failed:', errorText);
        }
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      }
    };

    fetchUser();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Loading...</div>;

  const handleLogOut = async () => {
    try{
      let response = await fetch('http://localhost:8000/auth/logout', {
        method: 'GET',
        credentials: 'include',
      });

      if(response.redirected){
        navigate('/');
      }
      else{
        setError('Error Logging Out');
      }
    }
    catch(err){
      console.log(err.message);
    }
  }

  return (
    <div>
      <p>Welcome, {user.name || 'Guest'}</p>
      <a href="#" onClick={handleLogOut}>Log Out</a>
      <p>{error}</p>
    </div>
  );
};

export default Dashboard;
