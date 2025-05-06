import React from 'react'
import PostCard from './PostCard'
import postApi from '../api/postApi'

const PostsList = ({posts, onUpdateClicked, onDeleteSuccess}) => {
  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postApi.deletePost(postId);
        await  onDeleteSuccess();
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post');
      }
    }
  };

  return (
    <div className="space-y-6">
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onUpdateClicked={onUpdateClicked}
          onDeleteClicked={handleDelete}
        />
      ))}
    </div>
  )
}

export default PostsList