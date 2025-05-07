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
  LIKE: { id: 'like', icon: ThumbsUp, color: 'text-blue-500', label: 'Like', bgColor: 'bg-blue-100' },
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

 