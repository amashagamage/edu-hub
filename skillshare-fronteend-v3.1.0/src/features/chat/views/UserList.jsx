import React from 'react';

const UserList = ({ users, selectedUser, onSelectUser }) => {
  // Generate a random status for demo purposes
  // In a real app, you would get this from your backend
  const getRandomStatus = (userId) => {
    const statuses = ['online', 'offline', 'away'];
    // Using userId as a seed to ensure consistent status for each user
    const index = userId.toString().charCodeAt(0) % statuses.length;
    return statuses[index];
  };

  // Get a status color based on the status
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  // Get a formatted date string for last message time
  // In a real app, this would come from your actual message data
  const getLastMessageTime = (userId) => {
    const dates = ['Just now', '5m ago', '30m ago', '2h ago', 'Yesterday'];
    const index = userId.toString().charCodeAt(0) % dates.length;
    return dates[index];
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <h1 className="text-xl font-bold">Chats</h1>
      </div>
      
      <div className="divide-y divide-gray-200">
        {users.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No contacts found
          </div>
        ) : (
          users.map(user => {
            const status = getRandomStatus(user.id);
            const statusColor = getStatusColor(status);
            const lastMessageTime = getLastMessageTime(user.id);
            
            return (
              <div
                key={user.id}
                className={`p-4 hover:bg-indigo-50 cursor-pointer transition-colors duration-150 ${
                  selectedUser?.id === user.id ? 'bg-indigo-100' : ''
                }`}
                onClick={() => onSelectUser(user)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${statusColor} border-2 border-white`}></div>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{user.username}</p>
                      <p className="text-sm text-gray-500 truncate max-w-[140px]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {lastMessageTime}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UserList;