import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import userApi from "../../auth/api/userApi";
import FollowUserHeader from "./FollowUserHeader";
import FollowUserPosts from "./FollowUserPosts";
import relationApi from "../api/relationApi";

const FollowUserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [canViewPosts, setCanViewPosts] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch user data and followers in parallel
        const [userData, followersList, followingStatus] = await Promise.all([
          userApi.getUserById(id),
          relationApi.getFollowers(id),
          currentUserId ? relationApi.isFollowing(currentUserId, id) : Promise.resolve(false)
        ]);

        setUser(userData);
        setFollowers(followersList);
        setIsFollowing(followingStatus);
        
        // Determine if posts should be visible
        const canView = userData.publicStatus || 
                       (currentUserId && (currentUserId === id || followingStatus));
        setCanViewPosts(canView);
        
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [id, currentUserId]);

  const handleFollowStatusChange = async (newFollowingStatus) => {
    try {
      setIsFollowing(newFollowingStatus);
      
      // Update canViewPosts based on new follow status
      if (!user.publicStatus) {
        setCanViewPosts(newFollowingStatus || currentUserId === id);
      }
      
      // Update followers count optimistically
      setFollowers(prev => {
        if (newFollowingStatus) {
          return [...prev, { id: currentUserId }]; // Add current user to followers
        } else {
          return prev.filter(follower => follower.id !== currentUserId); // Remove current user
        }
      });
     
    } catch (error) {
      console.error("Error updating follow status:", error);
      // Revert changes if there was an error
      setIsFollowing(!newFollowingStatus);
    }finally{
      window.location.reload()
    }
  };

  if (isLoading) {
    return <div className="w-[55vw] flex justify-center items-center">Loading...</div>;
  }

  if (!user) {
    return <div className="w-[55vw] flex justify-center items-center">User not found</div>;
  }

  return (
    <div className="w-[80vw] flex justify-center items-center flex-col">
      <FollowUserHeader 
        user={user} 
        followers={followers}
        isFollowing={isFollowing}
        onFollowChange={handleFollowStatusChange}
      />
      
      {canViewPosts ? (
        <FollowUserPosts userId={user.id}  />
      ) : (
        <div className="w-full max-w-[935px] mt-8 bg-white border rounded-lg p-8 text-center">
          <div className="mx-auto w-24 h-24 rounded-full border-2 border-black flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">This Account is Private</h2>
          <p className="text-gray-600 mb-4">
            Follow this account to see their photos and videos.
          </p>
          {currentUserId && currentUserId !== id && !isFollowing && (
            <button
              onClick={() => handleFollowStatusChange(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600"
            >
              Follow
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FollowUserProfile;