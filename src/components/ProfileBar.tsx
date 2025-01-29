import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ProfileSettings from './ProfileSettings';

const ProfileBar = ({ user }) => {
  if (!user) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="w-full bg-slate-800 py-4">
      <div className="flex justify-between items-center">
        <p className="text-xl text-white px-3">{user.name || 'Guest'}</p>
        <ProfileSettings user={user.name} />
      </div>
    </div>
  );
};

export default ProfileBar;


