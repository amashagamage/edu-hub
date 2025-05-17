import { useState, useEffect } from "react";
import React from "react";
import { ThumbsUp, MessageCircle, Send, X, MoreVertical, Edit, Trash, MessageCircleOff, Heart, SmilePlus } from "lucide-react";
import Modal from "react-modal";
import commentApi from "../api/commentApi";
import likeApi from "../api/likeApi";

// CSS animations for reactions
const reactionStyles = `
  @keyframes pulse-once {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  
  @keyframes pop {
    0% { transform: scale(0.8); opacity: 0.7; }
    50% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  
  .animate-pulse {
    animation: pulse-once 0.5s ease-in-out;
  }
  
  .reaction-pop {
    animation: pop 0.4s ease-out;
  }
  
  .reaction-menu-appear {
    animation: pop 0.3s ease-out;
  }
`;

// For accessibility - bind modal to your app element
Modal.setAppElement("#root"); // Adjust this to match your app's root element ID

// Define reaction types and their icons
const REACTIONS = {
  LIKE: { id: 'like', icon: ThumbsUp, color: 'text-green-500', label: 'Like', bgColor: 'bg-green-100' },
  HEART: { id: 'heart', icon: Heart, color: 'text-pink-500', label: 'Heart', bgColor: 'bg-pink-100' },
  CARE: { id: 'care', icon: 'care', color: 'text-yellow-500', label: 'Care', bgColor: 'bg-yellow-100', emoji: '🤗' },
  HAHA: { id: 'haha', icon: 'haha', color: 'text-yellow-500', label: 'Haha', bgColor: 'bg-yellow-100', emoji: '😂' },
  WOW: { id: 'wow', icon: 'wow', color: 'text-yellow-500', label: 'Wow', bgColor: 'bg-yellow-100', emoji: '😮' },
  ANGRY: { id: 'angry', icon: 'angry', color: 'text-red-500', label: 'Angry', bgColor: 'bg-red-100', emoji: '😡' },
};

const LikeCommentContainer = ({ postId, postedUserId }) => {
  const userId = localStorage.getItem("userId");
  
  // States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [currentReaction, setCurrentReaction] = useState(null);
  const [showReactionMenu, setShowReactionMenu] = useState(false);
  const [reactionCounts, setReactionCounts] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [commentMenuOpen, setCommentMenuOpen] = useState(null);
  const [loading, setLoading] = useState({
    likes: true,
    comments: false,
    submitComment: false,
    toggleLike: false,
    editComment: false,
    deleteComment: false
  });
  const [error, setError] = useState({
    likes: null,
    comments: null,
    submitComment: null,
    toggleLike: null,
    editComment: null,
    deleteComment: null
  });

  // Modal custom styles
  const customModalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '80vh',
      padding: 0,
      borderRadius: '8px',
      overflow: 'hidden'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000
    }
  };

  // Close reaction menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showReactionMenu) {
        setShowReactionMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showReactionMenu]);

  // Fetch like count and status on mount
  useEffect(() => {
    fetchLikeData();
    
    // Fetch comment count
    const fetchCommentCount = async () => {
      try {
        const commentCountData = await commentApi.getCommentCountForPost(postId);
        setCommentCount(commentCountData);
      } catch (error) {
        console.error("Failed to fetch comment count:", error);
      }
    };
    
    fetchCommentCount();
  }, [postId, userId]);
  
  // Function to fetch like data that can be called multiple times
  const fetchLikeData = async () => {
    try {
      setLoading(prev => ({ ...prev, likes: true }));
      setError(prev => ({ ...prev, likes: null }));
      
      const summary = await likeApi.getLikeSummaryForPost(postId, userId);
      setLikeCount(summary.count);
      setIsLiked(summary.liked);
      
      // Set reaction type if user has reacted
      if (summary.liked && summary.reactionType) {
        setCurrentReaction(summary.reactionType);
      } else {
        setCurrentReaction(null);
      }

      // Set reaction counts if available in the API response
      if (summary.reactionCounts) {
        setReactionCounts(summary.reactionCounts);
      } else {
        // Fallback if API doesn't provide detailed counts
        setReactionCounts({
          like: Math.floor(summary.count * 0.5),
          heart: Math.floor(summary.count * 0.2),
          care: Math.floor(summary.count * 0.1),
          haha: Math.floor(summary.count * 0.1),
          wow: Math.floor(summary.count * 0.05),
          angry: Math.floor(summary.count * 0.05),
        });
      }
      
      console.log("Fetched like data:", summary);
    } catch (error) {
      console.error("Failed to fetch like data:", error);
      setError(prev => ({ ...prev, likes: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, likes: false }));
    }
  };

  // Fetch comments when modal opens
  useEffect(() => {
    if (isModalOpen) {
      fetchComments();
    } else {
      // Close any open comment menus when modal closes
      setCommentMenuOpen(null);
      setEditingCommentId(null);
    }
  }, [isModalOpen,]);

  // Click outside handler for comment menu
  useEffect(() => {
    const handleClickOutside = () => {
      setCommentMenuOpen(null);
    };

    if (commentMenuOpen !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [commentMenuOpen]);

  const fetchComments = async () => {
    try {
      setLoading(prev => ({ ...prev, comments: true }));
      setError(prev => ({ ...prev, comments: null }));
      
      const fetchedComments = await commentApi.getCommentsByPostId(postId);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      setError(prev => ({ ...prev, comments: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, comments: false }));
    }
  };

  // Handle modal open/close
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Toggle reaction menu
  const handleReactionMenuToggle = (e) => {
    e.stopPropagation();
    setShowReactionMenu(prev => !prev);
  };

  // Handle like toggle
  const handleReactionSelect = async (reactionType) => {
    if (!userId) {
      alert("Please log in to react to this post");
      return;
    }
    
    try {
      setLoading(prev => ({ ...prev, toggleLike: true }));
      setError(prev => ({ ...prev, toggleLike: null }));
      
      // If clicking the same reaction, remove it
      const shouldRemove = currentReaction === reactionType;
      
      console.log("Reaction select:", { 
        userId, 
        postId, 
        reactionType, 
        shouldRemove, 
        currentReaction 
      });
      
      // Call API to toggle reaction
      const result = await likeApi.toggleLike(userId, { 
        postId, 
        reactionType: shouldRemove ? null : reactionType 
      });
      
      console.log("Toggle like result:", result);
      
      // Update UI based on API response instead of optimistically
      if (result === null) {
        // Like was removed
        setCurrentReaction(null);
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
        
        // Update reaction counts
        setReactionCounts(prev => ({
          ...prev,
          [reactionType]: Math.max(0, (prev[reactionType] || 1) - 1)
        }));
      } else {
        // Like was added or changed
        const oldReaction = currentReaction;
        const newReaction = result.reactionType || reactionType;
        
        // Update reaction counts
        setReactionCounts(prev => {
          const updated = { ...prev };
          
          // Decrement old reaction count if changing reaction
          if (oldReaction && oldReaction !== newReaction) {
            updated[oldReaction] = Math.max(0, (updated[oldReaction] || 1) - 1);
          }
          
          // Increment new reaction count
          updated[newReaction] = (updated[newReaction] || 0) + 1;
          
          return updated;
        });
        
        // Update current reaction and like status
        setCurrentReaction(newReaction);
        setIsLiked(true);
        
        // Only increment total count if not already liked
        if (!isLiked) {
          setLikeCount(prev => prev + 1);
        }
      }
      
      // Hide the reaction menu
      setShowReactionMenu(false);
      
      // Refresh like data to ensure UI is in sync with server
      setTimeout(() => {
        fetchLikeData();
      }, 500);
    } catch (error) {
      console.error("Failed to toggle reaction:", error);
      setError(prev => ({ ...prev, toggleLike: error.message }));
      alert("Failed to save your reaction. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, toggleLike: false }));
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentContent.trim()) return;
    if (!userId) {
      alert("Please log in to comment");
      return;
    }
    
    try {
      setLoading(prev => ({ ...prev, submitComment: true }));
      setError(prev => ({ ...prev, submitComment: null }));
      
      const newComment = await commentApi.createComment(userId, {
        content: commentContent,
        postId: postId
      });
      
      // Update UI with new comment
      setComments(prev => [newComment, ...prev]);
      setCommentContent("");
      setCommentCount(prev => prev + 1);
    } catch (error) {
      console.error("Failed to submit comment:", error);
      setError(prev => ({ ...prev, submitComment: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, submitComment: false }));
    }
  };

  // Handle comment edit start
  const handleEditStart = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.content);
    setCommentMenuOpen(null);
  };

  // Handle comment update
  const handleUpdateComment = async (commentId) => {
    if (!editCommentContent.trim()) return;
    
    try {
      setLoading(prev => ({ ...prev, editComment: true }));
      setError(prev => ({ ...prev, editComment: null }));
      
      const updatedComment = await commentApi.updateComment(commentId, userId, {
        content: editCommentContent
      });
      
      // Update UI with edited comment
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId ? { ...comment, content: updatedComment.content } : comment
        )
      );
      
      // Reset edit state
      setEditingCommentId(null);
      setEditCommentContent("");
    } catch (error) {
      console.error("Failed to update comment:", error);
      setError(prev => ({ ...prev, editComment: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, editComment: false }));
    }
  };

  // Handle comment delete
  const handleDeleteComment = async (commentId) => {
    console.log(`Comment is going to delete ${commentId}`)
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }
    
    try {
      setLoading(prev => ({ ...prev, deleteComment: true }));
      setError(prev => ({ ...prev, deleteComment: null }));
      
      await commentApi.deleteComment(commentId, userId);
      
      // Update UI by removing the deleted comment
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      setCommentCount(prev => prev - 1);
      setCommentMenuOpen(null);
    } catch (error) {
      console.error("Failed to delete comment:", error);
      setError(prev => ({ ...prev, deleteComment: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, deleteComment: false }));
    }
  };

  // Check if user can edit or delete a comment
  const canEditComment = (commentUserId) => {
    return userId === commentUserId;
  };

  const canDeleteComment = (commentUserId) => {
    
    return userId === postedUserId || userId === commentUserId;
  };

  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Cancel comment edit
  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditCommentContent("");
  };

  // Get reaction icon component based on reaction type
  const getReactionIcon = (type) => {
    const reaction = REACTIONS[type.toUpperCase()];
    if (!reaction) return ThumbsUp;
    
    if (reaction.icon === 'care') return () => <span className="text-xl">🤗</span>;
    if (reaction.icon === 'haha') return () => <span className="text-xl">😂</span>;
    if (reaction.icon === 'wow') return () => <span className="text-xl">😮</span>;
    if (reaction.icon === 'angry') return () => <span className="text-xl">😡</span>;
    
    return reaction.icon;
  };

  // Get reaction color based on type
  const getReactionColor = (type) => {
    return REACTIONS[type?.toUpperCase()]?.color || 'text-gray-500';
  };

  // Get reaction background color based on type
  const getReactionBgColor = (type) => {
    return REACTIONS[type?.toUpperCase()]?.bgColor || 'bg-gray-100';
  };

  // Get reaction label based on type
  const getReactionLabel = (type) => {
    return REACTIONS[type?.toUpperCase()]?.label || 'Like';
  };

  // This function adds a simple visual feedback when liking/unliking
  const handleLikeWithFeedback = async (reactionType) => {
    const likeButton = document.getElementById(`like-button-${postId}`);
    if (likeButton) {
      likeButton.classList.add('animate-pulse');
      setTimeout(() => {
        likeButton.classList.remove('animate-pulse');
      }, 1000);
    }
    
    await handleReactionSelect(reactionType);
  };

  return (
    <div className="flex flex-col">
      <style>{reactionStyles}</style>
      
      {/* Like and Comment Stats & Buttons */}
      <div className="flex items-center justify-between py-3 px-4 border-t border-gray-200 bg-gray-50 rounded-lg my-1">
        {/* Stats */}
        <div className="flex text-sm space-x-5">
          <div className="flex items-center">
            {/* Show top 3 reaction icons if there are reactions */}
            {likeCount > 0 ? (
              <div className="flex -space-x-1 mr-2">
                {Object.entries(reactionCounts)
                  .filter(([_, count]) => count > 0)
                  .sort(([_, countA], [__, countB]) => countB - countA)
                  .slice(0, 3)
                  .map(([type]) => {
                    const ReactionIcon = getReactionIcon(type);
                    return (
                      <span 
                        key={type} 
                        className={`${getReactionBgColor(type)} ${getReactionColor(type)} w-6 h-6 rounded-full flex items-center justify-center border border-white`}
                      >
                        <ReactionIcon size={12} />
                      </span>
                    );
                  })}
              </div>
            ) : (
              <span className="w-6 h-6 mr-2"></span>
            )}
            <span className="font-medium">{loading.likes ? "..." : likeCount}</span>
          </div>
          <span className="flex items-center bg-white px-3 py-1 rounded-full shadow-sm transition-all hover:shadow-md">
            <MessageCircle size={16} className="mr-1.5 text-green-500" />
            <span className="font-medium">{commentCount} comments</span>
          </span>
        </div>
        
        {/* Error Display */}
        {error.likes && (
          <div className="text-red-500 text-xs font-medium px-2 py-1 bg-red-50 rounded-md">{error.likes}</div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-around py-2 border-t border-gray-200">
        <div className="relative w-1/2">
          {/* Main Reaction Button */}
          <button
            id={`like-button-${postId}`}
            onClick={() => handleLikeWithFeedback(isLiked ? currentReaction : 'like')}
            onMouseEnter={handleReactionMenuToggle}
            className={`flex-1 flex justify-center items-center gap-1.5 py-1.5 rounded-md transition-all ${
              isLiked
                ? 'text-green-600 hover:bg-green-50'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {currentReaction && getReactionIcon(currentReaction) ? (
              <span className="text-lg">
                {getReactionIcon(currentReaction)}
              </span>
            ) : (
              <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            )}
            <span className="text-sm font-medium">
              {currentReaction ? getReactionLabel(currentReaction) : 'Like'}
              {likeCount > 0 && ` (${likeCount})`}
            </span>
          </button>
          
          {/* Reaction Menu */}
          {showReactionMenu && (
            <div 
              className="absolute bottom-12 left-5 bg-white rounded-full shadow-lg p-1 flex gap-1 items-center z-10 border border-gray-100 reaction-menu-appear"
            >
              {Object.values(REACTIONS).map(reaction => (
                <button
                  key={reaction.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReactionSelect(reaction.id);
                  }}
                  className={`p-1.5 rounded-full transition-transform hover:scale-125 ${getReactionBgColor(reaction.id)} reaction-pop`}
                  title={reaction.label}
                >
                  {reaction.emoji ? (
                    <span className="text-lg">{reaction.emoji}</span>
                  ) : (
                    <reaction.icon className={`w-5 h-5 ${getReactionColor(reaction.id)}`} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="mx-1"></div>
        
        <button
          onClick={openModal}
          className="flex items-center justify-center w-1/2 py-2.5 text-gray-500 rounded-lg hover:bg-green-50 hover:text-green-500 transition-all transform hover:scale-105"
        >
          <MessageCircle size={20} className="mr-2" />
          Comment
        </button>
      </div>
      
      {/* Comments Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
        contentLabel="Comments Modal"
      >
        <div className="flex flex-col h-full">
          {/* Modal Header */}
          <div className="flex justify-between items-center border-b px-5 py-4 bg-gradient-to-r from-black to-green-600 text-white">
            <h3 className="text-lg font-semibold">Comments</h3>
            <button onClick={closeModal} className="text-white hover:text-white/80 bg-green-700 hover:bg-green-800 p-1.5 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="p-4 border-b bg-black">
            <div className="flex">
              <input
                type="text"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write a comment..."
                className="flex-grow px-4 py-3 border border-green-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
                disabled={loading.submitComment}
              />
              <button
                type="submit"
                disabled={!commentContent.trim() || loading.submitComment}
                className="bg-green-500 text-white px-5 rounded-r-lg hover:bg-green-600 disabled:bg-green-300 flex items-center justify-center shadow-sm transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
            {error.submitComment && (
              <p className="text-red-500 text-xs mt-2 bg-red-50 p-2 rounded">{error.submitComment}</p>
            )}
          </form>
          
          {/* Comments List */}
          <div className="flex-grow overflow-y-auto p-4" style={{ maxHeight: "calc(80vh - 160px)" }}>
            {loading.comments ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="mb-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  {editingCommentId === comment.id ? (
                    // Edit Comment Form
                    <div className="mt-1">
                      <textarea
                        value={editCommentContent}
                        onChange={(e) => setEditCommentContent(e.target.value)}
                        className="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows={2}
                        disabled={loading.editComment}
                      />
                      <div className="flex justify-end mt-3 space-x-2">
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md border border-gray-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdateComment(comment.id)}
                          disabled={!editCommentContent.trim() || loading.editComment}
                          className="px-4 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 shadow-sm"
                        >
                          {loading.editComment ? "Saving..." : "Save"}
                        </button>
                      </div>
                      {error.editComment && (
                        <p className="text-red-500 text-xs mt-2 bg-red-50 p-2 rounded">{error.editComment}</p>
                      )}
                    </div>
                  ) : (
                    // Regular Comment View
                    <div className="flex items-start">
                      {comment.user?.profileImageUrl ? (
                        <img
                          src={comment.user.profileImageUrl}
                          alt={comment.user.username}
                          className="w-10 h-10 rounded-full mr-3 border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-black to-green-500 rounded-full mr-3 flex items-center justify-center text-white font-bold border-2 border-gray-200">
                          {comment.user?.username?.charAt(0) || "U"}
                        </div>
                      )}
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <p className="font-semibold text-gray-800">{comment.user?.username || "Unknown User"}</p>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 mr-3 bg-gray-100 px-2 py-0.5 rounded-full">
                              {formatDate(comment.createdAt)}
                            </span>
                            {/* Comment Menu Button - Only show if user can edit or delete */}
                           
                              <div className="relative flex space-x-1">
                       
                                {canEditComment(comment.user?.id) && (
                                      <button
                                        onClick={() => handleEditStart(comment)}
                                        className="flex items-center p-1.5 text-gray-500 hover:text-green-500 hover:bg-green-50 rounded-full transition-colors"
                                      >
                                        <Edit size={16} />
                                      </button>
                                    )}
                                    {canDeleteComment(comment.user?.id) && (
                                      <button
                                        onClick={() => handleDeleteComment(comment.id)}
                                        className="flex items-center p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                      >
                                        <Trash size={16} />
                                      </button>
                                    )}
                              </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 rounded-lg mt-2 border-l-4 border-green-400">
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <MessageCircleOff className="mx-auto mb-2 text-gray-300" size={36} />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
            
            {error.comments && (
              <div className="text-center py-4 text-red-500 bg-red-50 rounded-lg my-2">
                {error.comments}
              </div>
            )}
            
            {error.deleteComment && (
              <div className="text-center py-3 text-red-500 bg-red-50 rounded-lg my-2">
                {error.deleteComment}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LikeCommentContainer;