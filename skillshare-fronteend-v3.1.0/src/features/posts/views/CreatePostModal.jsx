import React, { useState, useRef } from "react";
import Modal from "react-modal";
import { uploadFile } from "../../../services/uploadFileService";
import postApi from "../api/postApi";
import { 
  X, 
  Image, 
  Video,
  FileVideo, 
  Upload, 
  Paperclip, 
  AlertCircle, 
  Loader2, 
  Send, 
  Plus,
  Map,
  Tag,
  Users,
  Globe
} from "lucide-react";

// Required by react-modal for accessibility
Modal.setAppElement("#root");

const CreatePostModal = ({ onRefresh }) => {
  const userId = localStorage.getItem("userId");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [currentTab, setCurrentTab] = useState("content");
  const [postPrivacy, setPostPrivacy] = useState("public");
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    medias: [],
    location: "",
    tags: [],
    mentionedUsers: []
  });
  const [currentTag, setCurrentTag] = useState("");

  const validateFile = (file) => {
    if (file.type.startsWith("image/")) return true;

    if (file.type.startsWith("video/")) {
      return new Promise((resolve) => {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          resolve(video.duration <= 30);
        };
        video.src = URL.createObjectURL(file);
      });
    }

    return false;
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || e.dataTransfer?.files || []);

    if (formData.medias.length + files.length > 3) {
      setError("Maximum 3 files allowed");
      return;
    }

    for (const file of files) {
      const isValid = await validateFile(file);
      if (!isValid) {
        setError("Invalid file type or video duration exceeds 30 seconds");
        return;
      }
    }

    setError("");
    setIsLoading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const url = await uploadFile(file);
        return {
          url,
          type: file.type.startsWith("image/") ? "image" : "video",
          name: file.name
        };
      });

      const uploadedMedias = await Promise.all(uploadPromises);
      setFormData((prev) => ({
        ...prev,
        medias: [...prev.medias, ...uploadedMedias],
      }));
    } catch (error) {
      console.error("Error uploading files:", error);
      setError("Failed to upload files");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }
    if (formData.medias.length === 0) {
      setError("At least one media file is required");
      return;
    }

    setIsLoading(true);
    try {
      // Add tags and location if provided
      const postData = {
        ...formData,
        privacy: postPrivacy,
        // Only include non-empty fields
        ...(formData.location && { location: formData.location }),
        ...(formData.tags.length > 0 && { tags: formData.tags }),
        ...(formData.mentionedUsers.length > 0 && { mentionedUsers: formData.mentionedUsers })
      };

      await postApi.createPost(userId, postData);
      await onRefresh();
      setFormData({ 
        title: "", 
        description: "", 
        medias: [],
        location: "",
        tags: [],
        mentionedUsers: []
      });
      setIsOpen(false);
    } catch (error) {
      setError(error.message || "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  const removeMedia = (index) => {
    setFormData((prev) => ({
      ...prev,
      medias: prev.medias.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-6 mb-12 w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02]"
      >
        <Plus className="w-5 h-5" />
        Create New Post
      </button>

      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="Create Post Modal"
        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full outline-none overflow-hidden"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        {/* Header with tabs */}
        <div className="border-b border-gray-200">
          <div className="flex justify-between items-center px-6 py-4">
            <h2 className="text-xl font-bold text-gray-900">Create New Post</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setCurrentTab("content")}
              className={`px-6 py-3 text-sm font-medium flex items-center ${
                currentTab === "content"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Content
            </button>
            <button
              onClick={() => setCurrentTab("media")}
              className={`px-6 py-3 text-sm font-medium flex items-center ${
                currentTab === "media"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Media
            </button>
            <button
              onClick={() => setCurrentTab("options")}
              className={`px-6 py-3 text-sm font-medium flex items-center ${
                currentTab === "options"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Advanced
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          {/* Content Tab */}
          {currentTab === "content" && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Give your post a title..."
                  className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Share your thoughts, experiences, or knowledge..."
                  rows="5"
                  className="block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              
              {/* Privacy Setting */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Privacy
                </label>
                <div className="flex space-x-3 mt-1">
                  <button
                    type="button"
                    onClick={() => setPostPrivacy("public")}
                    className={`flex items-center px-3 py-2 rounded-md text-sm ${
                      postPrivacy === "public"
                        ? "bg-blue-100 text-blue-700 border border-blue-300"
                        : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Public
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostPrivacy("followers")}
                    className={`flex items-center px-3 py-2 rounded-md text-sm ${
                      postPrivacy === "followers"
                        ? "bg-blue-100 text-blue-700 border border-blue-300"
                        : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Followers
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostPrivacy("private")}
                    className={`flex items-center px-3 py-2 rounded-md text-sm ${
                      postPrivacy === "private"
                        ? "bg-blue-100 text-blue-700 border border-blue-300"
                        : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    <div className="w-4 h-4 mr-2">🔒</div>
                    Private
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Media Tab */}
          {currentTab === "media" && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Media Files
                  </label>
                  <span className="text-xs text-gray-500">
                    {formData.medias.length}/3 files
                  </span>
                </div>

                {/* Drag and Drop Area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`mt-1 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  } ${formData.medias.length >= 3 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    multiple
                    disabled={formData.medias.length >= 3}
                    className="hidden"
                  />
                  
                  <div className="space-y-2">
                    <div className="mx-auto flex justify-center">
                      <Upload className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                    </div>
                    <p className="text-xs text-gray-500">
                      Images or videos (max 30 seconds)
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview Area */}
              {formData.medias.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">Previews</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {formData.medias.map((media, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden bg-gray-100">
                        {media.type === "image" ? (
                          <img
                            src={media.url}
                            alt={`Upload ${index + 1}`}
                            className="h-28 w-full object-cover"
                          />
                        ) : (
                          <div className="relative h-28 w-full bg-gray-800 flex items-center justify-center">
                            <video
                              src={media.url}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                              <FileVideo className="h-10 w-10 text-white opacity-80" />
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all">
                          <button
                            type="button"
                            onClick={() => removeMedia(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1 truncate">
                          {media.name || `File ${index + 1}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Advanced Options Tab */}
          {currentTab === "options" && (
            <div className="space-y-5">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location (optional)
                </label>
                <div className="flex">
                  <div className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg">
                    <Map className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((prev) => ({ 
                        ...prev, 
                        location: e.target.value 
                      }))
                    }
                    placeholder="Add your location"
                    className="flex-grow border border-gray-300 rounded-r-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (optional)
                </label>
                <div className="flex">
                  <div className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add tags and press Enter"
                    className="flex-grow border border-gray-300 rounded-r-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
                
                {/* Display tags */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm flex items-center"
                      >
                        #{tag}
                        <button 
                          type="button" 
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-blue-500 hover:text-blue-700"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Creating...
                </span>
              ) : (
                <span className="flex items-center">
                  <Send className="h-4 w-4 mr-2" />
                  Create Post
                </span>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreatePostModal;
