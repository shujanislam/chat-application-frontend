import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const StatusMenu = ({ user, onClose }) => {
  const [status, setStatus] = useState("online");
  const [error, setError] = useState(null);
  const socket = io("http://localhost:8000"); // Initialize socket

  useEffect(() => {
    // Fetch the user's last known status from the server
    const fetchStatus = async () => {
      try {
        const res = await fetch(`http://localhost:8000/auth/user`, {
          credentials: "include",
        });

        const data = await res.json();
        if (res.ok && data.status) {
          setStatus(data.status); // Set the saved status from DB
        }
      } catch (err) {
        console.log("Error fetching status:", err);
      }
    };

    fetchStatus();

    return () => {
      socket.disconnect(); // Cleanup
    };
  }, []);

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await fetch("http://localhost:8000/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, status: newStatus }),
      });

      if (res.ok) {
        console.log("Status updated successfully");
        setStatus(newStatus);
        socket.emit("status_change", { username: user, status: newStatus });
      } else {
        setError("Failed to update status");
      }
    } catch (err) {
      console.log(err.message);
      setError("Network error");
    }
  };

  const statusOptions = [
    { label: "Online", value: "online" },
    { label: "Do Not Disturb", value: "dnd" },
    { label: "Idle", value: "idle" },
    { label: "Offline", value: "offline" },
  ];

  return (
    <div className="absolute top-0 right-0 translate-x-2 transform -translate-y-full bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 w-48">
      <div className="py-1">
        {statusOptions.map(({ label, value }) => (
          <button
            key={value}
            className={`block px-4 py-2 text-sm w-full text-left ${
              status === value ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => handleStatusChange(value)}
          >
            {label}
          </button>
        ))}
      </div>
      {error && <div className="px-4 py-2 text-sm text-red-600 bg-red-50">{error}</div>}
    </div>
  );
};

export default StatusMenu;
