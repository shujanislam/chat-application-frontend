import { useEffect, useState } from 'react';

const Users = ({ user, onUserSelect }) => {
  const [users, setUsers] = useState([]); // Store users as an array of objects
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;

      try {
        const response = await fetch('http://localhost:8000/get-users', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currentUser: user }), // Send current user
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUsers(data.data); // Use the `data` array from the API response
            console.log(data.data);
          } else {
            setError(data.message || 'Failed to fetch users');
          }
        } else {
          setError('Failed to fetch users. Server responded with an error.');
        }
      } catch (error) {
        setError('An error occurred while fetching users.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Users List</h2>
      {users.length > 0 ? (
        <ul className="space-y-2">
          {users.map(({ name, status }, index) => (
            <li 
              key={index}
              className="cursor-pointer hover:bg-gray-100 p-2 rounded"
              onClick={() => onUserSelect(name)}
            >
              <div className="flex justify-between">
                <span>{name}</span>
                <span className={`text-sm ${status === 'online' ? 'text-green-500' : 'text-gray-500'}`}>
                  {status}
                </span>
              </div>
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

