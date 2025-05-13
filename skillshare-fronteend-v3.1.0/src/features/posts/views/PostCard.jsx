import React, { useState } from 'react';
import moment from 'moment';
import { MoreHorizontal, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import LikeCommentContainer from './LikeCommentContainer';

const PostCard = ({ post, onUpdateClicked, onDeleteClicked }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const userId = localStorage.getItem('userId');

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % post.medias.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + post.medias.length) % post.medias.length);
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
       <Link
          to={post.postedBy.id === userId ? "/profile" : `/profile/${post.postedBy.id}`}
       >
       <div className="flex items-center space-x-3">
          <img
            src={post.postedBy.profileImageUrl}
            alt={`${post.postedBy.firstName}'s profile`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold">
              {post.postedBy.firstName} {post.postedBy.lastName}
            </h3>
            <p className="text-sm text-gray-500">
              {moment(post.postedAt).fromNow()}
            </p>
          </div>
        </div>
       </Link>
        
        {userId === post.postedBy.id && (
          <div className="relative">
            <button 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
                <button
                  onClick={() => {
                    onUpdateClicked(post);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Post
                </button>
                <button
                  onClick={() => {
                    onDeleteClicked(post.id);
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 mb-4">
        <h4 className="font-semibold mb-2">{post.title}</h4>
        <p className="text-gray-600">{post.description}</p>
      </div>

      {/* Media Carousel */}
      <div className="relative">
        <div className="aspect-w-16 aspect-h-9 bg-black z-1">
          {post.medias[currentMediaIndex].type === 'image' ? (
            <img
              src={post.medias[currentMediaIndex].url}
              alt={`Post media ${currentMediaIndex + 1}`}
              className="object-contain w-full h-full"
            />
          ) : (
            <video
              src={post.medias[currentMediaIndex].url}
              controls
              className="object-contain w-full h-full"
            />
          )}
        </div>
        
        {post.medias.length > 1 && (
          <>
            <button
              onClick={prevMedia}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-1.5 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMedia}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-1.5 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {post.medias.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentMediaIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <LikeCommentContainer postId={post.id} postedUserId={post.postedBy.id}/>
    </div>
  );
};

export default PostCard;