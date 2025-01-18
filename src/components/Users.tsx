import { useEffect, useState } from 'react';

const Users = ({ user, onUserSelect }) => {
  const [names, setNames] = useState([]);
  const [status, setStatus] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNames = async () => {
      if (!user) return;

      try {
        const response = await fetch('http://localhost:8000/get-users', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currentUser: user }), // Renamed to be more explicit
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setNames(data.names);
            console.log(data); 
          } else {
            setError(data.message || 'Failed to fetch names');
          }
        } else {
          setError('Failed to fetch names. Server responded with an error.');
        }
      } catch (error) {
        setError('An error occurred while fetching names.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNames();
  }, [user]); // Add user as dependency

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Users List</h2>
      {names.length > 0 ? (
        <ul className="space-y-2">
          {names.map((name, index) => (
            <li 
              key={index}
              className="cursor-pointer hover:bg-gray-100 p-2 rounded"
              onClick={() => onUserSelect(name)}
            >
              <span>{name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No other users available</p>
      )}
    </div>
  );
};

export default Users;
