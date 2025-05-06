import { useEffect, useState } from "react";
import CreatePostModal from "./CreatePostModal";
import UpdatePostModal from "./UpdatePostModal";
import postApi from "../api/postApi";
import PostsList from "./PostsList";

const PostPage = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState();
  const [updaetModalOpened, setUpdaetModalOpened] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await postApi.getAllPosts();

      setPosts(response.reverse());
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postApi.getAllPosts();
        setPosts(response.reverse());
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, []);
  return (
    <div className="flex justify-center items-center">
      <div className="w-[55vw]">
      <CreatePostModal onRefresh={fetchPosts} />
      {selectedPost && (
        <UpdatePostModal
          onClose={() => {
            setSelectedPost();
            setUpdaetModalOpened(false);
          }}
          open={updaetModalOpened}
          selectedPost={selectedPost}
          onRefresh={fetchPosts}
        />
      )}
      <PostsList
        posts={posts}
        onUpdateClicked={(post) => {
          setSelectedPost(post);
          setUpdaetModalOpened(true);
        }}
        onDeleteSuccess={fetchPosts}
      />
    </div>
    </div>
  );
};

export default PostPage;
