import React, { useEffect, useState } from 'react';
import postApi from '../../posts/api/postApi';

const FollowUserPosts = ({ userId }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const setInitialData = async () => {
      try {
        const res = await postApi.getPostsByUser(userId);
        setPosts(res);
      } catch (error) {
        console.error(`Error setting initial data: ${error}`);
      }
    };
    setInitialData();
  }, [userId]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {posts.map((post) =>
        post.medias.map((media, index) => (
          <div key={`${post.id}-${index}`} className="relative w-full aspect-square overflow-hidden rounded-lg shadow">
            {media.type === 'image' ? (
              <img
                src={media.url}
                alt={`Post ${post.id}`}
                className="object-cover w-full h-full"
              />
            ) : (
              <video
                src={media.url}
                controls
                className="object-cover w-full h-full"
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default FollowUserPosts;
