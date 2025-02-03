import { useState } from "react";
import ProfileSettings from "./ProfileSettings";
import Friends from "./Friends";
import AddFriends from "./AddFriends";

const ProfileBar = ({ user, userId, setSelectedUserChat }) => {
  if (!user) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="fixed left-0 top-0 h-full bg-slate-800 p-4 flex flex-col justify-between w-72">
      {/* Top Section: User Info */}
      <div className="flex flex-col items-center w-full text-white">
        <p className="text-lg font-semibold">{user.name || "Guest"}</p>
        <p className="text-xs text-gray-400">#{userId}</p>
      </div>

      {/* Middle Section: Friends List */}
      <div className="flex-1 overflow-y-auto w-full">
        <Friends userFriend={user.name} onUserSelect={(selectedUser) => setSelectedUserChat(selectedUser)} />
      </div>

      {/* Add Friend Section */}
      <div className="w-full mt-4">
        <AddFriends user={user.name} />
      </div>

      {/* Bottom Section: Profile Settings */}
      <div className="w-full mt-4">
        <ProfileSettings user={user.name} />
      </div>
    </div>
  );
};

export default ProfileBar;

