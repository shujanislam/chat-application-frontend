import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ProfileSettings from './ProfileSettings';

const ProfileBar = ({ user }) => { 

  if (!user) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="w-100 bg-slate-800 py-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl text-white">{user.name || 'Guest'}</p>
        <ProfileSettings />  
      </div>
    </div>
  );
};

export default ProfileBar;

