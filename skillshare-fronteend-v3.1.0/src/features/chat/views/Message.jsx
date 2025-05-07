import React, { useState } from 'react';

const Message = ({ 
  message, 
  isEditing, 
  onStartEdit, 
  onCancelEdit, 
  onSubmitEdit, 
  onDelete 
}) => {
  const [editContent, setEditContent] = useState(message.content);
  const [showActions, setShowActions] = useState(false);
  const currentUserId = localStorage.getItem('userId');
  const isCurrentUser = message.sender.id === currentUserId;

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editContent.trim() && editContent !== message.content) {
      onSubmitEdit(message.id, editContent);
    } else {
      onCancelEdit();
    }
  };

  // Format the timestamp into a readable format
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
             date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div 
      className={`group mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {!isCurrentUser && (
        <div className="flex-shrink-0 mr-3">
          <div className="w-8 h-8 rounded-full bg-indigo-400 flex items-center justify-center text-white text-xs font-medium">
            {message.sender.username?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      )}
      
      <div 
        className={`max-w-xs lg:max-w-md relative transition-all duration-200 ${
          isEditing ? 'w-full' : ''
        }`}
      >
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="flex flex-col bg-white rounded-lg shadow-md p-3 border border-gray-200">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="border border-gray-300 p-2 mb-2 rounded resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              autoFocus
              rows={3}
            />
            <div className="flex space-x-2 justify-end">
              <button 
                type="button" 
                onClick={onCancelEdit}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <div 
            className={`px-4 py-3 rounded-xl shadow-sm ${
              isCurrentUser 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-none' 
                : 'bg-white border border-gray-200 rounded-bl-none'
            }`}
          >
            <p className={`text-sm ${isCurrentUser ? 'text-white' : 'text-gray-800'}`}>{message.content}</p>
            
            <div className={`flex justify-between items-center mt-1.5 ${isCurrentUser ? 'text-indigo-100' : 'text-gray-400'}`}>
              <span className="text-xs">
                {formatTime(message.sentAt)}
                {message.isEdited && (
                  <span className="ml-1 italic">(edited)</span>
                )}
              </span>
              
              {isCurrentUser && showActions && (
                <div className={`flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                  <button 
                    onClick={() => onStartEdit(message.id)}
                    className={`text-xs hover:underline focus:outline-none ${isCurrentUser ? 'text-indigo-100 hover:text-white' : 'text-gray-400 hover:text-gray-700'}`}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => onDelete(message.id)}
                    className={`text-xs hover:underline focus:outline-none ${isCurrentUser ? 'text-indigo-100 hover:text-white' : 'text-gray-400 hover:text-gray-700'}`}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {isCurrentUser && (
        <div className="flex-shrink-0 ml-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
            {message.sender.username?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;