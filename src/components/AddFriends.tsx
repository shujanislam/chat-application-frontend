import { useState } from "react";

const AddFriends = ({ user }) => {
  const [friendId, setFriendId] = useState("");
  const [message, setMessage] = useState(null);

  const handleAddFriend = async () => {
    if (!friendId.trim()) {
      setMessage({ type: "error", text: "Please enter a friend ID." });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/addfriend/${user}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId }),
      });

      const data = await response.json(); // Await the response data

      if (response.ok) {
        setMessage({ type: "success", text: "Friend added successfully!" });
        setFriendId(""); // Clear input after success
      } else {
        setMessage({ type: "error", text: data.message || "Something went wrong." });
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    }
  };

  return (
    <div className="p-4 w-80 bg-white rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-3">Add Friend</h2>
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="#friend_id"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={friendId}
          onChange={(e) => setFriendId(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={handleAddFriend}
        >
          Add
        </button>
      </div>
      {message && (
        <p className={`mt-2 text-sm ${message.type === "error" ? "text-red-500" : "text-green-500"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
};

export default AddFriends;

