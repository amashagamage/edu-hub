import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { uploadFile } from "../../../services/uploadFileService";
import postApi from "../api/postApi";

// For accessibility - bind modal to your app element
Modal.setAppElement("#root"); 

const UpdatePostModal = ({ onClose, open, selectedPost, onRefresh }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    medias: [],
  });

  // Custom modal styles
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
      maxHeight: '90vh',
      padding: 0,
      borderRadius: '8px',
      overflow: 'auto'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000
    }
  };

  // Initialize form data when selectedPost changes
  useEffect(() => {
    if (selectedPost) {
      setFormData({
        title: selectedPost.title || "",
        description: selectedPost.description || "",
        medias: selectedPost.medias || [],
      });
    }
  }, [selectedPost]);

  const validateFile = (file) => {
    if (file.type.startsWith("image/")) {
      return true;
    } else if (file.type.startsWith("video/")) {
      return new Promise((resolve) => {
        const video = document.createElement("video");
        video.preload = "metadata";

        video.onloadedmetadata = function () {
          window.URL.revokeObjectURL(video.src);
          resolve(video.duration <= 30);
        };

        video.src = URL.createObjectURL(file);
      });
    }
    return false;
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

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
        const url = await uploadFile(file, (progress) => {
          console.log(`Upload progress: ${progress}%`);
        });
        return {
          url,
          type: file.type.startsWith("image/") ? "image" : "video",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
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
      await postApi.updatePost(selectedPost.id, formData);
      if (onRefresh) {
        await onRefresh();
      }
      onClose();
    } catch (error) {
      setError(error.message || "Failed to update post");
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

  const handleCancel = () => {
    // Reset form data to original post data
    if (selectedPost) {
      setFormData({
        title: selectedPost.title || "",
        description: selectedPost.description || "",
        medias: selectedPost.medias || [],
      });
    }
    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={open}
      onRequestClose={handleCancel}
      style={customModalStyles}
      contentLabel="Update Post Modal"
    >
      <div className="bg-white rounded-lg shadow-xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Update Post</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
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
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Media Files ({formData.medias.length}/3)
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              multiple
              disabled={formData.medias.length >= 3 || isLoading}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />
          </div>

          {formData.medias.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {formData.medias.map((media, index) => (
                <div key={index} className="relative">
                  {media.type === "image" ? (
                    <img
                      src={media.url}
                      alt={`Upload ${index + 1}`}
                      className="h-20 w-20 object-cover rounded"
                    />
                  ) : (
                    <video
                      src={media.url}
                      className="h-20 w-20 object-cover rounded"
                      controls
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeMedia(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Updating..." : "Update Post"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UpdatePostModal;