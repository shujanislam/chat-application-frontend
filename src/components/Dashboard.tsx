import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileBar from "./ProfileBar";
import Chatbox from "./Chatbox";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState('');
  const [selectedUserChat, setSelectedUserChat] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8000/auth/user", {
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const data = await response.json();
        setUser(data.user);
        setUserId(data.user_id); // This triggers the second useEffect
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
        navigate("/");
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div className="flex h-screen">
      <div className="w-72 bg-slate-800">
        <ProfileBar user={user} userId={userId} setSelectedUserChat={setSelectedUserChat} />
      </div>
      <div className="flex-1 bg-white p-4 overflow-y-auto h-full">
        <Chatbox user={user} selectedUserChat={selectedUserChat} />
      </div>
    </div>
  );
};

export default Dashboard;
