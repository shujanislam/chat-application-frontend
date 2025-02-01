import { useEffect, useState } from 'react';

const Friends = ({ userFriend }) => {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!userFriend) {
        setError("No user provided.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/getfriends/${userFriend}`);

        if (response.ok) {
          const data = await response.json();

          if (data.success) {
            setFriends(data.data);
          } else {
            setError("Failed to fetch friends.");
          }
        } else {
          setError("Failed to fetch data from the server.");
        }
      } catch (error) {
        setError("An error occurred while fetching data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [userFriend]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (loading) {
    return <div>Loading friends...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Friends List</h2>
      {friends.length > 0 ? (
        <ul className="space-y-2">
          {friends.map(({ name, status }, index) => (
            <li key={index} className="cursor-pointer hover:bg-gray-100 p-2 rounded">
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
        <p>No friends found</p>
      )}
    </div>
  );
};

export default Friends;
