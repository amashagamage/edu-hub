import React, { useEffect, useState } from 'react'
import userApi from '../../auth/api/userApi'
import { uploadFile } from '../../../services/uploadFileService'
import { useNavigate } from 'react-router-dom'
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Calendar, 
    Info, 
    Upload, 
    Save, 
    Trash2, 
    LogOut, 
    Eye, 
    EyeOff,
    CheckCircle,
    AlertCircle,
    Loader2
} from 'lucide-react'

const CurrentUserProfilePage = () => {
    const userId = localStorage.getItem('userId')
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)
    const [profileImage, setProfileImage] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)
    const [imageHover, setImageHover] = useState(false)
    const [activeSection, setActiveSection] = useState('personalInfo')
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        bio: '',
        contactNumber: '',
        gender: '',
        address: '',
        birthday: '',
        publicStatus: false
    })
    const navigate = useNavigate()
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true)
                const response = await userApi.getUserById(userId)
                setUser(response)
                setFormData({
                    firstName: response.firstName || '',
                    lastName: response.lastName || '',
                    bio: response.bio || '',
                    contactNumber: response.contactNumber || '',
                    gender: response.gender || '',
                    address: response.address || '',
                    birthday: response.birthday || '',
                    publicStatus: response.publicStatus || false
                })
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [userId])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Reset success state when form is changed
        setSaveSuccess(false)
    }

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            console.log("Selected file:", file.name, file.type, file.size);
            setProfileImage(file);
            setPreviewImage(URL.createObjectURL(file));
            setSaveSuccess(false);
        }
    }

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        // First Name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) {
            newErrors.firstName = "First name should contain only letters";
        }

        // Last Name validation
        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) {
            newErrors.lastName = "Last name should contain only letters";
        }

        // Contact Number validation
        if (formData.contactNumber && !/^\d{10}$/.test(formData.contactNumber)) {
            newErrors.contactNumber = "Contact number must be 10 digits";
        }

        // Birthday validation
        if (formData.birthday) {
            const birthDate = new Date(formData.birthday);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            if (age < 10) {
                newErrors.birthday = "You must be at least 10 years old";
            }
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setLoading(true);
            try {
                let profileImageUrl = user?.profileImageUrl;

                if (profileImage) {
                    console.log("Uploading profile image:", profileImage.name);
                    try {
                        const imageUrl = await uploadFile(profileImage, 'profile-images');
                        console.log("Upload successful, URL:", imageUrl);
                        profileImageUrl = imageUrl;
                    } catch (uploadError) {
                        console.error("Image upload failed:", uploadError);
                        alert("Failed to upload profile image. Please try again.");
                        setLoading(false);
                        return;
                    }
                }

                const updatedUserData = {
                    ...formData,
                    profileImageUrl
                };
                
                console.log("Updating user with data:", updatedUserData);
                const response = await userApi.updateUser(userId, updatedUserData);
                console.log("Update response:", response);
                setUser(response);
                setSaveSuccess(true);
                
                // Auto-hide success message after 3 seconds
                setTimeout(() => {
                    setSaveSuccess(false);
                }, 3000);
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('Failed to update profile');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.clear();
            navigate('/login');
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                await userApi.deleteUser(userId);
                localStorage.clear();
                navigate('/login');
            } catch (error) {
                console.error('Error deleting account:', error);
                alert('Failed to delete account');
            }
        }
    };

    if (loading && !user) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-white to-purple-50">
            <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
                <p className="mt-4 text-lg text-gray-700">Loading your profile...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Success notification */}
                {saveSuccess && (
                    <div className="fixed top-6 right-6 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-4 rounded shadow-lg transform transition-all duration-500 animate-fade-in flex items-center z-50">
                        <CheckCircle className="mr-3 h-5 w-5 text-emerald-500" />
                        <span>Profile updated successfully!</span>
                    </div>
                )}
                
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
                    {/* Header section with background gradient and profile image */}
                    <div className="relative h-48 bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-white opacity-20"></div>
                            <div className="absolute -left-12 -bottom-12 w-40 h-40 rounded-full bg-white opacity-20"></div>
                        </div>
                        <h1 className="text-3xl font-bold text-white relative z-10">Edit Your Profile</h1>
                        <p className="text-indigo-100 mt-1 relative z-10">Customize your information and appearance</p>
                        
                        {/* Profile image with hover effect */}
                        <div className="absolute -bottom-16 left-8">
                            <div 
                                className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden group transition-all duration-300"
                                onMouseEnter={() => setImageHover(true)}
                                onMouseLeave={() => setImageHover(false)}
                            >
                                <img 
                                    src={previewImage || user?.profileImageUrl || '/images/placeholder-avatar.png'} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:opacity-50"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://ui-avatars.com/api/?name=" + 
                                            (user?.firstName || 'User') + "+" + (user?.lastName || '') + 
                                            "&background=6366f1&color=fff&size=150";
                                    }}
                                />
                                <label 
                                    className={`absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50 cursor-pointer transition-opacity duration-300 ${imageHover ? 'opacity-100' : 'opacity-0'}`}
                                >
                                    <Upload className="h-6 w-6" />
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 pt-20">
                        {/* Navigation tabs */}
                        <div className="flex mb-8 border-b overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 pb-2">
                            <button 
                                type="button"
                                onClick={() => setActiveSection('personalInfo')}
                                className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-all ${
                                    activeSection === 'personalInfo' 
                                        ? 'text-indigo-600 border-b-2 border-indigo-600' 
                                        : 'text-gray-500 hover:text-indigo-600'
                                }`}
                            >
                                Personal Info
                            </button>
                            <button 
                                type="button"
                                onClick={() => setActiveSection('contactInfo')}
                                className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-all ${
                                    activeSection === 'contactInfo' 
                                        ? 'text-indigo-600 border-b-2 border-indigo-600' 
                                        : 'text-gray-500 hover:text-indigo-600'
                                }`}
                            >
                                Contact Info
                            </button>
                            <button 
                                type="button"
                                onClick={() => setActiveSection('privacy')}
                                className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-all ${
                                    activeSection === 'privacy' 
                                        ? 'text-indigo-600 border-b-2 border-indigo-600' 
                                        : 'text-gray-500 hover:text-indigo-600'
                                }`}
                            >
                                Privacy Settings
                            </button>
                            <button 
                                type="button"
                                onClick={() => setActiveSection('account')}
                                className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-all ${
                                    activeSection === 'account' 
                                        ? 'text-indigo-600 border-b-2 border-indigo-600' 
                                        : 'text-gray-500 hover:text-indigo-600'
                                }`}
                            >
                                Account
                            </button>
                        </div>

                        {/* Personal Info Section */}
                        <div className={`transition-all duration-300 ${activeSection === 'personalInfo' ? 'block' : 'hidden'}`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <User className="h-4 w-4 mr-2 text-indigo-500" />
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className={`block w-full border ${errors.firstName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm transition-all duration-200`}
                                    />
                                    {errors.firstName && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle className="h-3 w-3 mr-1" />
                                            {errors.firstName}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <User className="h-4 w-4 mr-2 text-indigo-500" />
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className={`block w-full border ${errors.lastName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm transition-all duration-200`}
                                    />
                                    {errors.lastName && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle className="h-3 w-3 mr-1" />
                                            {errors.lastName}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <Info className="h-4 w-4 mr-2 text-indigo-500" />
                                        Bio
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                                        rows="3"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                                        Birthday
                                    </label>
                                    <input
                                        type="date"
                                        name="birthday"
                                        value={formData.birthday}
                                        onChange={handleInputChange}
                                        className={`block w-full border ${errors.birthday ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm transition-all duration-200`}
                                    />
                                    {errors.birthday && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle className="h-3 w-3 mr-1" />
                                            {errors.birthday}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <User className="h-4 w-4 mr-2 text-indigo-500" />
                                        Gender
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info Section */}
                        <div className={`transition-all duration-300 ${activeSection === 'contactInfo' ? 'block' : 'hidden'}`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <Phone className="h-4 w-4 mr-2 text-indigo-500" />
                                        Contact Number
                                    </label>
                                    <input
                                        type="text"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleInputChange}
                                        className={`block w-full border ${errors.contactNumber ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md shadow-sm py-2 px-3 focus:outline-none sm:text-sm transition-all duration-200`}
                                        placeholder="10-digit phone number"
                                    />
                                    {errors.contactNumber && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle className="h-3 w-3 mr-1" />
                                            {errors.contactNumber}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-medium text-gray-700">
                                        <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                                        placeholder="Your address"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <p className="text-sm text-gray-500 italic">
                                        Your contact information is only shared with users who you connect with directly.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Privacy Settings Section */}
                        <div className={`transition-all duration-300 ${activeSection === 'privacy' ? 'block' : 'hidden'}`}>
                            <div className="space-y-6">
                                <div className="bg-indigo-50 rounded-lg p-4 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-md font-medium text-indigo-800">Profile Visibility</h3>
                                            <p className="text-sm text-indigo-600 mt-1">
                                                {formData.publicStatus ? 'Your profile is visible to everyone' : 'Your profile is only visible to approved connections'}
                                            </p>
                                        </div>
                                        <div 
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                publicStatus: !prev.publicStatus
                                            }))}
                                            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${formData.publicStatus ? 'bg-indigo-600' : 'bg-gray-200'}`}
                                        >
                                            <span className="sr-only">Toggle visibility</span>
                                            <span 
                                                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-300 ${formData.publicStatus ? 'translate-x-5' : 'translate-x-0'}`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                                    <h3 className="text-md font-medium text-gray-700 flex items-center">
                                        {formData.publicStatus ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                                        {formData.publicStatus ? 'Public Profile' : 'Private Profile'}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {formData.publicStatus
                                            ? 'With a public profile, anyone can view your profile information and learning progress.'
                                            : 'With a private profile, only approved connections can view your profile information and learning progress.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Account Section */}
                        <div className={`transition-all duration-300 ${activeSection === 'account' ? 'block' : 'hidden'}`}>
                            <div className="space-y-6">
                                <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                                    <h3 className="text-lg font-medium text-red-800 mb-2">Danger Zone</h3>
                                    <p className="text-sm text-red-600 mb-4">
                                        The following actions are permanent and cannot be undone.
                                    </p>
                                    <div className="space-y-3">
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleDeleteAccount}
                                            className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fixed action button at the bottom */}
                        <div className="sticky bottom-0 bg-white pt-4 pb-2 mt-6 border-t">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white transition-all duration-300 transform 
                                ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02]'} 
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CurrentUserProfilePage;