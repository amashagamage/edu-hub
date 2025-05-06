import React, { useState, useRef } from 'react';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const fileInputRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const addEmoji = (emoji) => {
    setMessage(prevMessage => prevMessage + emoji);
    setShowEmoji(false);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Common emoji list
  const commonEmojis = [
    '😊', '😂', '❤️', '👍', '😍', 
    '😎', '🙌', '👏', '🎉', '🔥',
    '👀', '💡', '💯', '✅', '🚀'
  ];

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {/* Emoji picker */}
      {showEmoji && (
        <div className="bg-white rounded-lg shadow-lg p-2 mb-2 border border-gray-200 flex flex-wrap">
          {commonEmojis.map((emoji, index) => (
            <button 
              key={index} 
              onClick={() => addEmoji(emoji)}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden pr-2">
          {/* Emoji button */}
          <button
            type="button"
            onClick={() => setShowEmoji(!showEmoji)}
            className="p-2 text-gray-500 hover:text-indigo-500 focus:outline-none transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          {/* Attachment button */}
          <button
            type="button"
            onClick={handleFileButtonClick}
            className="p-2 text-gray-500 hover:text-indigo-500 focus:outline-none transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={() => alert('File attachment functionality would be implemented here')}
              accept="image/*"
            />
          </button>
          
          {/* Message input */}
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setIsTyping(e.target.value.length > 0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-transparent py-3 px-3 focus:outline-none resize-none max-h-24"
            rows={1}
            style={{ minHeight: '44px' }}
          />
          
          {/* Send button */}
          <button
            type="submit"
            disabled={!message.trim()}
            className={`rounded-full p-2 ml-1 transition-all duration-200 ${
              isTyping 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white transform scale-100' 
                : 'bg-gray-200 text-gray-400 transform scale-90'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </form>
      
      {/* Typing indicator - would connect to a real-time backend */}
      <div className="h-4 mt-1 px-2">
        <span className="text-xs text-gray-400 italic">
          {/* This would be populated by the backend */}
        </span>
      </div>
    </div>
  );
};

export default MessageInput;