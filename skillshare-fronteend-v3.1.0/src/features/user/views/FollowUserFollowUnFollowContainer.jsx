import React, { useState, useEffect } from "react";
import relationApi from "../api/relationApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FollowUserFollowUnFollowContainer = ({ userId }) => {
  const currentUserId = localStorage.getItem("userId");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Check follow status and get counts on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if current user is following this user
        if (currentUserId && currentUserId !== userId) {
          const followingStatus = await relationApi.isFollowing(currentUserId, userId);
          setIsFollowing(followingStatus);
        }

        // Get followers count
        const followers = await relationApi.getFollowersCount(userId);
        setFollowersCount(followers);

        // Get following count
        const following = await relationApi.getFollowingCount(userId);
        setFollowingCount(following);
      } catch (error) {
        console.error(error)
        toast.error("Failed to load follow data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, currentUserId]);

  const handleFollow = async () => {
    if (!currentUserId) {
      toast.error("Please login to follow users");
      return;
    }

    try {
      setIsLoading(true);
      await relationApi.followUser(currentUserId, userId);
      setIsFollowing(true);
      setFollowersCount(prev => prev + 1);
      toast.success("Successfully followed user");
    } catch (error) {
      toast.error(error.message || "Failed to follow user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollow = async () => {
    try {
      setIsLoading(true);
      await relationApi.unfollowUser(currentUserId, userId);
      setIsFollowing(false);
      setFollowersCount(prev => prev - 1);
      toast.success("Successfully unfollowed user");
    } catch (error) {
      toast.error(error.message || "Failed to unfollow user");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex space-x-6 text-sm">
        <div>
          <span className="font-semibold">...</span> followers
        </div>
        <div>
          <span className="font-semibold">...</span> following
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-6">
      <div className="flex space-x-6 text-sm">
        <div>
          <span className="font-semibold">{followersCount}</span> followers
        </div>
        <div>
          <span className="font-semibold">{followingCount}</span> following
        </div>
      </div>
      
      {currentUserId && currentUserId !== userId && (
        <button
          onClick={isFollowing ? handleUnfollow : handleFollow}
          disabled={isLoading}
          className={`px-4 py-1 rounded-md text-sm font-medium ${
            isFollowing
              ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isFollowing ? "Unfollowing..." : "Following..."}
            </span>
          ) : isFollowing ? (
            "Following"
          ) : (
            "Follow"
          )}
        </button>
      )}
    </div>
  );
};

export default FollowUserFollowUnFollowContainer;