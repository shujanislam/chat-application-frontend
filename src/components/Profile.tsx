import { useState, useEffect } from "react";

const Profile = ({ user, isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [userid, setUserId] = useState("");
  const [status, setStatus] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        let res = await fetch(`http://localhost:8000/fetch-profile-data/${user}`);

        if (res.ok) {
          let data = await res.json();
          setName(data.name);
          setNewName(data.name); // Initialize newName with the fetched name
          setUserId(data.user_id);
          setStatus(data.status);
        } else {
          console.log("Server Error");
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  if (!isOpen) return null; // Do not render modal if it's not open

  const startEditing = () => setIsEditing(true);
  const cancelEditing = () => {
    setIsEditing(false);
    setNewName(name); // Reset to original name if canceled
  };

  const changeName = async () => {
    if (newName.trim() === "" || newName === name) {
      cancelEditing(); // Prevent empty names or redundant updates
      return;
    }

    try {
      console.log('working') 
    } catch (error) {
      console.error("Failed to update name:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <div className="flex justify-center items-center gap-2">
          {isEditing ? (
            <input
              type="text"
              className="border border-gray-300 rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-400"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") changeName();
                if (e.key === "Escape") cancelEditing();
              }}
              autoFocus
            />
          ) : (
            <p className="text-gray-800 font-medium">{name}</p>
          )}
          {!isEditing && (
            <button onClick={startEditing} className="text-gray-400 text-xs hover:text-gray-600">
              Edit
            </button>
          )}
        </div>

        <p className="text-gray-600">#{userid}</p>
        <p className="text-gray-600">{status}</p>

        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Profile;
