import React from 'react';
import FollowUserFollowUnFollowContainer from './FollowUserFollowUnFollowContainer';

const FollowUserHeader = ({ user }) => {
  return (
    <div className="flex items-center px-6 py-8 space-x-8">
      {/* Profile Picture */}
      <div className="flex-shrink-0">
        <img
          src={user.profileImageUrl}
          alt={`${user.firstName} ${user.lastName}`}
          className="w-24 h-24 rounded-full object-cover"
        />
      </div>

      {/* User Info */}
      <div className="flex flex-col space-y-4 flex-1">
        {/* Username + Follow Button */}
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold">{user.username}</h2>
      
        </div>

        {/* Stats - You can replace with real data */}
        <FollowUserFollowUnFollowContainer userId={user.id} />
        

        {/* Bio */}
        <div className="text-sm">
          <p className="font-semibold">{user.firstName} {user.lastName}</p>
          <p>{user.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default FollowUserHeader;
