import React, { useState, useEffect } from 'react';
import userApi from '../../auth/api/userApi';
import { uploadFile } from '../../../services/uploadFileService';

const ProfileImageTest = () => {
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadUrl, setUploadUrl] = useState('');

  // Fetch user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await userApi.getUserById(userId);
        console.log("Fetched user data:", userData);
        setUser(userData);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    } else {
      setError("No user is logged in");
      setLoading(false);
    }
  }, [userId]);

  const handleImageSelect = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      console.log("Selected file:", file.name, file.type, file.size);
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadSuccess(false);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    try {
      setLoading(true);
      console.log("Starting file upload...");
      const imageUrl = await uploadFile(selectedImage, 'profile-images');
      console.log("Upload successful, URL:", imageUrl);
      setUploadUrl(imageUrl);
      setUploadSuccess(true);
    } catch (error) {
      console.error("Image upload failed:", error);
      setError("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!uploadUrl) return;
    
    try {
      setLoading(true);
      const updatedData = {
        ...user,
        profileImageUrl: uploadUrl
      };
      
      console.log("Updating user profile with:", updatedData);
      const response = await userApi.updateUser(userId, updatedData);
      console.log("Update response:", response);
      setUser(response);
      alert("Profile image updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile Image Test</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Current User Info</h2>
        {user ? (
          <div className="space-y-4">
            <p><span className="font-medium">Name:</span> {user.firstName} {user.lastName}</p>
            <p><span className="font-medium">Email:</span> {user.email}</p>
            <p><span className="font-medium">Profile Image URL:</span> {user.profileImageUrl || "None"}</p>
            
            <div className="mt-4">
              <h3 className="text-md font-medium mb-2">Current Profile Image:</h3>
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
                <img 
                  src={user.profileImageUrl || "/images/placeholder-avatar.png"} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://ui-avatars.com/api/?name=" + 
                      (user.firstName || 'User') + "+" + (user.lastName || '') + 
                      "&background=6366f1&color=fff&size=150";
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <p>No user data available</p>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Step 1: Select & Upload Image</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Select Image:</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageSelect}
              className="block w-full text-sm border border-gray-300 rounded-md cursor-pointer p-2"
            />
          </div>
          
          {previewUrl && (
            <div className="mt-4">
              <h3 className="text-md font-medium mb-2">Preview:</h3>
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          
          <button
            onClick={handleImageUpload}
            disabled={!selectedImage || loading}
            className={`px-4 py-2 rounded-md ${
              !selectedImage || loading 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? 'Uploading...' : 'Upload Image'}
          </button>
          
          {uploadSuccess && (
            <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
              <p className="font-medium">Upload Successful!</p>
              <p className="text-sm break-all mt-1">{uploadUrl}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Step 2: Update Profile</h2>
        <button
          onClick={handleProfileUpdate}
          disabled={!uploadSuccess || loading}
          className={`px-4 py-2 rounded-md ${
            !uploadSuccess || loading 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {loading ? 'Updating...' : 'Update Profile with New Image'}
        </button>
      </div>
    </div>
  );
};

export default ProfileImageTest; 