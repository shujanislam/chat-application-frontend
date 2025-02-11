import { useEffect, useState } from "react";

const Friends = ({ userFriend, onUserSelect }) => {
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
    return <div className="text-red-500 text-xs">{error}</div>;
  }

  if (loading) {
    return <div className="text-gray-300 text-xs">Loading friends...</div>;
  }

  return (
    <div className="p-2">
      <h2 className="text-sm font-semibold mb-3 text-gray-300">Friends</h2>
      {friends.length > 0 ? (
        <ul className="space-y-1">
          {friends.map(({ name, status }, index) => (
            <li
              key={index}
              className="cursor-pointer hover:bg-gray-700 p-1 rounded flex items-center justify-between text-xs"
              onClick={() => onUserSelect(name)}
            >
              <span className="text-gray-200">{name}</span>
              <div className="flex items-center">
                <span className="text-gray-400">{status}</span>
                <span
                  className={`w-2 h-2 ml-1 rounded-full ${
                    status === "online"
                      ? "bg-green-500"
                      : status === "dnd"
                      ? "bg-red-500"
                      : status === "idle"
                      ? "bg-yellow-500"
                      : "bg-gray-500"
                  }`}
                ></span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-xs">No friends found</p>
      )}
    </div>
  );
};

export default Friends;
