import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createPortal } from "react-dom";
import ProgressUpdateApi from "../api/progressApi";
import { 
  PencilIcon, 
  TrashIcon, 
  ClockIcon, 
  StarIcon, 
  Workflow, 
  CheckCircleIcon, 
  SearchIcon, 
  FilterIcon,
  ListFilterIcon,
  PlusCircleIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  ArrowUpRightIcon,
  BarChart2,
  Award,
  Trophy,
  TrendingUp,
  Calendar,
  FileText,
  PlusIcon,
  ChevronRightIcon,
  Users,
  Globe,
  XIcon,
  AlertTriangleIcon
} from "lucide-react";

// Dropdown menu component using portal for better stacking
const DropdownMenu = ({ isOpen, onClose, buttonRef, children }) => {
  const menuRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen, buttonRef]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && 
          buttonRef.current && !buttonRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, buttonRef]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      ref={menuRef}
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999,
        minWidth: `${position.width}px`
      }}
      className="mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200"
    >
      {children}
    </div>,
    document.body
  );
};

// Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, updateTitle }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center mb-4 text-red-600">
          <div className="bg-red-100 p-2 rounded-full mr-3">
            <AlertTriangleIcon className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold">Delete Progress Update</h3>
          <button 
            onClick={onClose}
            className="ml-auto p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "<span className="font-medium">{updateTitle}</span>"? This action cannot be undone.
        </p>
        
        <div className="flex space-x-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
          >
            <TrashIcon className="w-4 h-4 mr-1.5" />
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const ProgressPage = () => {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "ALL",
    sortBy: "newest"
  });
  const [filteredUpdates, setFilteredUpdates] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [stats, setStats] = useState({
    totalHours: 0,
    totalUpdates: 0,
    thisWeekUpdates: 0,
    averageRating: 0
  });
  
  // State for delete confirmation modal
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    updateId: null,
    updateTitle: ""
  });
  
  // Refs for dropdown buttons
  const filterButtonRef = useRef(null);
  const sortButtonRef = useRef(null);

  // Create a new piece of state to track animation
  const [animateCount, setAnimateCount] = useState(false);
  const countRef = useRef(null);

  // Fetch progress updates on component mount
  useEffect(() => {
    const fetchProgressUpdates = async () => {
      try {
        // Get all progress updates for the feed
        const allUpdates = await ProgressUpdateApi.getAllProgressUpdates();
        setProgressUpdates(allUpdates);
        setFilteredUpdates(allUpdates);
        
        // Only calculate personal stats if user is logged in
        if (currentUserId) {
          try {
            // Make a separate API call specifically for the user's updates
            const userUpdates = await ProgressUpdateApi.getProgressUpdatesByUserId(currentUserId);
            
            const totalHours = userUpdates.reduce((sum, update) => sum + (update.hoursSpent || 0), 0);
            const validRatings = userUpdates.filter(update => update.rating).map(update => update.rating);
            const avgRating = validRatings.length ? 
              (validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length).toFixed(1) : 
              0;
              
            // Count updates from last 7 days
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const recentUpdates = userUpdates.filter(update => new Date(update.createdAt) >= oneWeekAgo);
            
            setStats({
              totalHours,
              totalUpdates: userUpdates.length,
              thisWeekUpdates: recentUpdates.length,
              averageRating: avgRating
            });
          } catch (userError) {
            console.error("Error fetching user updates:", userError);
            toast.error("Failed to load your personal progress stats");
          }
        } else {
          // Set default stats for non-logged in users
          setStats({
            totalHours: 0,
            totalUpdates: 0,
            thisWeekUpdates: 0,
            averageRating: 0
          });
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load progress updates");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgressUpdates();
  }, [currentUserId]);

  // Apply filters and search whenever these values change
  useEffect(() => {
    let result = [...progressUpdates];
    
    // Apply type filter
    if (filters.type !== "ALL") {
      result = result.filter(update => update.type === filters.type);
    }
    
    // Apply search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(update => 
        update.title.toLowerCase().includes(query) || 
        update.content.toLowerCase().includes(query) ||
        update.user.username.toLowerCase().includes(query) ||
        update.achievements.some(a => a.toLowerCase().includes(query)) ||
        update.challenges.some(c => c.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    if (filters.sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (filters.sortBy === "hoursSpent") {
      result.sort((a, b) => b.hoursSpent - a.hoursSpent);
    } else if (filters.sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    
    setFilteredUpdates(result);
  }, [searchQuery, filters, progressUpdates]);

  // Add a function to handle counting animation
  useEffect(() => {
    if (animateCount && countRef.current) {
      countRef.current.classList.add('animate-pulse-once');
      
      // Remove animation class after animation completes
      const timer = setTimeout(() => {
        if (countRef.current) {
          countRef.current.classList.remove('animate-pulse-once');
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [animateCount]);

  // Add animation trigger when filter updates change
  useEffect(() => {
    setAnimateCount(true);
    const timer = setTimeout(() => {
      setAnimateCount(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [filteredUpdates.length]);

  // Handle initiating delete (shows confirmation modal)
  const handleDeleteClick = (update) => {
    setDeleteModal({
      isOpen: true,
      updateId: update.id,
      updateTitle: update.title
    });
  };
  
  // Handle closing the delete modal
  const handleCloseDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      updateId: null,
      updateTitle: ""
    });
  };
  
  // Handle confirmed delete progress update
  const handleConfirmDelete = async () => {
    try {
      await ProgressUpdateApi.deleteProgressUpdate(deleteModal.updateId);
      setProgressUpdates(
        progressUpdates.filter((update) => update.id !== deleteModal.updateId)
      );
      toast.success("Progress update deleted successfully");
      handleCloseDeleteModal();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete progress update");
    }
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format date to relative time
  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return formatDate(dateString);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter change
  const handleFilterChange = (type) => {
    setFilters({ ...filters, type });
    setShowFilters(false);
  };
  
  // Handle sort change
  const handleSortChange = (sortBy) => {
    setFilters({ ...filters, sortBy });
    setShowSortOptions(false);
  };

  // Get badge color based on update type
  const getBadgeColor = (type) => {
    switch (type) {
      case "MILESTONE":
        return {
          bgColor: "bg-purple-100",
          textColor: "text-purple-800",
          dotColor: "bg-purple-500",
          icon: <StarIcon className="w-3.5 h-3.5 text-purple-600" />
        };
      case "DAILY_UPDATE":
        return {
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          dotColor: "bg-blue-500",
          icon: <CalendarDaysIcon className="w-3.5 h-3.5 text-blue-600" />
        };
      case "CHALLENGE":
        return {
          bgColor: "bg-orange-100",
          textColor: "text-orange-800", 
          dotColor: "bg-orange-500",
          icon: <Workflow className="w-3.5 h-3.5 text-orange-600" />
        };
      default:
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          dotColor: "bg-gray-500",
          icon: <FileText className="w-3.5 h-3.5 text-gray-600" />
        };
    }
  };

  // Function to check if the current user is the owner of an update
  const isUserOwner = (update) => {
    // Make sure we have both the current user ID and the update user ID
    if (!currentUserId || !update.user) return false;
    
    // Compare the user IDs as strings to ensure proper comparison
    return currentUserId.toString() === update.user.id.toString();
  };

  // CSS for animations - add additional hover styles for cards
  const styleTag = `
    @keyframes gradient-x {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    .animated-gradient {
      background-size: 200% 200%;
      animation: gradient-x 3s ease infinite;
    }
    
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-3px); }
      100% { transform: translateY(0px); }
    }
    
    .float {
      animation: float 3s ease-in-out infinite;
    }
    
    @keyframes shine {
      0% {
        background-position: -100% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
    
    .shine {
      position: relative;
    }
    
    .shine::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      background-size: 200% 100%;
      animation: shine 3s infinite linear;
    }
    
    @keyframes pulse-once {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    .animate-pulse-once {
      animation: pulse-once 0.5s ease-in-out;
    }
    
    .btn-animated {
      position: relative;
      overflow: hidden;
      transition: all 0.3s;
    }
    
    .btn-animated::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transform: translateX(-100%);
    }
    
    .btn-animated:hover::before {
      animation: btn-shine 0.75s;
    }
    
    @keyframes btn-shine {
      100% {
        transform: translateX(100%);
      }
    }
    
    .filters-container {
      transition: all 0.3s ease;
    }
    
    .filters-container:hover {
      box-shadow: 0 10px 20px rgba(79, 70, 229, 0.1);
    }
    
    .community-badge {
      background: linear-gradient(45deg, #6366f1, #8b5cf6);
    }
    
    .card-hover {
      transition: all 0.3s ease;
    }
    
    .card-hover:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 20px rgba(79, 70, 229, 0.15);
    }
    
    .card-hover:hover .card-title {
      color: #4f46e5;
    }
    
    .card-hover:hover .card-action {
      opacity: 1;
      transform: translateY(0);
    }
    
    .card-hover:hover .card-badge {
      transform: scale(1.05);
    }
    
    .card-action {
      opacity: 0.8;
      transform: translateY(5px);
      transition: all 0.3s ease;
    }
    
    .card-badge {
      transition: all 0.3s ease;
    }
    
    .owner-actions {
      opacity: 0;
      transform: translateY(-5px);
      transition: all 0.3s ease;
    }
    
    .card-hover:hover .owner-actions {
      opacity: 1;
      transform: translateY(0);
    }
    
    .action-button {
      transition: all 0.2s ease;
    }
    
    .action-button:hover {
      transform: scale(1.15);
    }
    
    .edit-button:hover {
      background: rgba(79, 70, 229, 0.1);
      color: #4f46e5;
      box-shadow: 0 3px 10px rgba(79, 70, 229, 0.2);
    }
    
    .delete-button:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      box-shadow: 0 3px 10px rgba(239, 68, 68, 0.2);
    }
  `;

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
        <p className="mt-4 text-gray-500">Loading your progress updates...</p>
      </div>
    );
  }

  return (
    <>
      <style>{styleTag}</style>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 py-8">
        <div className="max-w-6xl mx-auto px-4 relative">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-indigo-300 filter blur-3xl"></div>
            <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-purple-300 filter blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full bg-pink-200 filter blur-3xl"></div>
          </div>

          <ToastContainer position="top-right" autoClose={3000} />

          {/* Hero Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white rounded-2xl p-8 shadow-xl mb-8 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
              <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-white opacity-20"></div>
              <div className="absolute -left-12 -bottom-12 w-40 h-40 rounded-full bg-white opacity-20"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Progress Dashboard</h1>
                  <p className="text-indigo-100 max-w-xl">Track your personal learning journey with detailed insights and accomplishments</p>
                </div>
                <button
                  onClick={() => navigate("/create-progress")}
                  className="mt-4 md:mt-0 flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <PlusCircleIcon className="w-5 h-5" />
                  New Update
                </button>
              </div>
              
              {/* Stats Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center mr-3">
                      <ClockIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white/70 text-xs uppercase tracking-wider">Your Hours</p>
                      <p className="text-white text-2xl font-bold">{stats.totalHours}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center mr-3">
                      <BarChart2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white/70 text-xs uppercase tracking-wider">Your Updates</p>
                      <p className="text-white text-2xl font-bold">{stats.totalUpdates}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center mr-3">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white/70 text-xs uppercase tracking-wider">Your Rating</p>
                      <p className="text-white text-2xl font-bold flex items-center">
                        {stats.averageRating}
                        <StarIcon className="w-4 h-4 ml-1 text-yellow-300" />
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center mr-3">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white/70 text-xs uppercase tracking-wider">This Week</p>
                      <p className="text-white text-2xl font-bold">{stats.thisWeekUpdates}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Search and Filters Section */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 mb-8 backdrop-blur-sm backdrop-filter relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/30 to-purple-50/30 opacity-50"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by title, content, username, achievements..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                  />
                </div>
                
                <div className="flex gap-3 flex-wrap md:flex-nowrap">
                  {/* Filter by Type Dropdown */}
                  <div className="relative min-w-[140px]">
                    <button 
                      ref={filterButtonRef}
                      onClick={() => {
                        setShowFilters(!showFilters);
                        setShowSortOptions(false);
                      }}
                      className="flex w-full items-center justify-between px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <FilterIcon className="h-4 w-4 text-indigo-500" />
                        <span>{filters.type === "ALL" ? "All Types" : filters.type.replace("_", " ")}</span>
                      </span>
                      <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    </button>
                    
                    <DropdownMenu 
                      isOpen={showFilters} 
                      onClose={() => setShowFilters(false)} 
                      buttonRef={filterButtonRef}
                    >
                      <div className="py-1 rounded-lg shadow-lg border border-gray-200">
                        <button 
                          onClick={() => handleFilterChange("ALL")} 
                          className={`flex w-full text-left px-4 py-2 text-sm ${filters.type === "ALL" ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                        >
                          All Types
                        </button>
                        <button 
                          onClick={() => handleFilterChange("MILESTONE")} 
                          className={`flex items-center w-full text-left px-4 py-2 text-sm ${filters.type === "MILESTONE" ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                        >
                          <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                            <StarIcon className="w-3.5 h-3.5 text-purple-600" />
                          </div>
                          Milestone
                        </button>
                        <button 
                          onClick={() => handleFilterChange("DAILY_UPDATE")} 
                          className={`flex items-center w-full text-left px-4 py-2 text-sm ${filters.type === "DAILY_UPDATE" ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                        >
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                            <CalendarDaysIcon className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          Daily Update
                        </button>
                        <button 
                          onClick={() => handleFilterChange("CHALLENGE")} 
                          className={`flex items-center w-full text-left px-4 py-2 text-sm ${filters.type === "CHALLENGE" ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                        >
                          <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mr-2">
                            <Workflow className="w-3.5 h-3.5 text-orange-600" />
                          </div>
                          Challenge
                        </button>
                      </div>
                    </DropdownMenu>
                  </div>
                  
                  {/* Sort Options Dropdown */}
                  <div className="relative min-w-[140px]">
                    <button 
                      ref={sortButtonRef}
                      onClick={() => {
                        setShowSortOptions(!showSortOptions);
                        setShowFilters(false);
                      }}
                      className="flex w-full items-center justify-between px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <ListFilterIcon className="h-4 w-4 text-indigo-500" />
                        <span>
                          {filters.sortBy === "newest" ? "Newest First" : 
                           filters.sortBy === "oldest" ? "Oldest First" : 
                           filters.sortBy === "hoursSpent" ? "Hours Spent" : "Highest Rating"}
                        </span>
                      </span>
                      <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    </button>
                    
                    <DropdownMenu 
                      isOpen={showSortOptions} 
                      onClose={() => setShowSortOptions(false)} 
                      buttonRef={sortButtonRef}
                    >
                      <div className="py-1 rounded-lg shadow-lg border border-gray-200">
                        <button 
                          onClick={() => handleSortChange("newest")} 
                          className={`flex items-center w-full text-left px-4 py-2 text-sm ${filters.sortBy === "newest" ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                        >
                          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                          Newest First
                        </button>
                        <button 
                          onClick={() => handleSortChange("oldest")} 
                          className={`flex items-center w-full text-left px-4 py-2 text-sm ${filters.sortBy === "oldest" ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                        >
                          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                          Oldest First
                        </button>
                        <button 
                          onClick={() => handleSortChange("hoursSpent")} 
                          className={`flex items-center w-full text-left px-4 py-2 text-sm ${filters.sortBy === "hoursSpent" ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                        >
                          <ClockIcon className="w-4 h-4 mr-2 text-gray-500" />
                          Hours Spent
                        </button>
                        <button 
                          onClick={() => handleSortChange("rating")} 
                          className={`flex items-center w-full text-left px-4 py-2 text-sm ${filters.sortBy === "rating" ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                        >
                          <StarIcon className="w-4 h-4 mr-2 text-gray-500" />
                          Highest Rating
                        </button>
                      </div>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
              
              {/* Active Filters Display */}
              {(filters.type !== "ALL" || searchQuery) && (
                <div className="flex flex-wrap items-center mt-4 gap-2">
                  <span className="text-sm text-gray-500">Active filters:</span>
                  {filters.type !== "ALL" && (
                    <span className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                      {getBadgeColor(filters.type).icon}
                      <span className="ml-1">Type: {filters.type.replace("_", " ")}</span>
                      <button
                        onClick={() => setFilters({...filters, type: "ALL"})}
                        className="ml-1.5 text-indigo-500 hover:text-indigo-700"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                      <SearchIcon className="w-3 h-3 mr-1" />
                      <span className="truncate max-w-[150px]">"{searchQuery}"</span>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="ml-1.5 text-indigo-500 hover:text-indigo-700"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  <button 
                    onClick={() => {
                      setSearchQuery("");
                      setFilters({...filters, type: "ALL"});
                    }}
                    className="text-xs text-indigo-500 hover:text-indigo-700 font-medium underline underline-offset-2"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Results Counter - Replace with enhanced version */}
          {filteredUpdates.length > 0 && (
            <div className="mb-6 bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 border border-indigo-100 filters-container">
              <div className="p-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animated-gradient"></div>
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="flex items-center mb-4 sm:mb-0">
                  <div className="h-10 w-10 rounded-full community-badge flex items-center justify-center shadow-md mr-3">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 font-medium">Showing progress updates from the community</h3>
                    <div className="flex items-center mt-1">
                      <div 
                        ref={countRef} 
                        className="text-xl font-bold text-indigo-700 mr-2"
                      >
                        {filteredUpdates.length}
                      </div>
                      <div className="text-sm text-gray-600">
                        {filteredUpdates.length !== progressUpdates.length && (
                          <>out of <span className="font-medium">{progressUpdates.length}</span> total</>
                        )} updates
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {filters.sortBy !== "newest" && (
                    <button
                      onClick={() => handleSortChange("newest")}
                      className="btn-animated text-sm px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 transition-colors flex items-center gap-1.5"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Show newest first</span>
                    </button>
                  )}
                  
                  <Link
                    to="/create-progress"
                    className="btn-animated text-sm px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white shadow-sm hover:shadow-indigo-500/20 hover:shadow-lg transition-all flex items-center gap-1.5"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>New update</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Progress Updates */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredUpdates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl bg-white shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-10 w-10 text-indigo-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {progressUpdates.length === 0 ? "No progress updates yet" : "No matching results"}
              </h3>
              <p className="text-gray-500 text-center mb-6 max-w-md">
                {progressUpdates.length === 0 
                  ? "Be the first to share your learning journey with the community." 
                  : "Try adjusting your search or filters to find what you're looking for."}
              </p>
              {progressUpdates.length === 0 ? (
                <button
                  onClick={() => navigate("/create-progress")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusIcon className="h-4 w-4 mr-1.5" />
                  Create progress update
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilters({...filters, type: "ALL"});
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FilterIcon className="h-4 w-4 mr-1.5" />
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredUpdates.map((update) => {
                const badgeInfo = getBadgeColor(update.type);
                // Use the isUserOwner function to check ownership
                const isOwner = isUserOwner(update);
                
                return (
                  <div 
                    key={update.id} 
                    className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden relative card-hover"
                  >
                    {/* Type Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <div 
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${badgeInfo.bgColor} ${badgeInfo.textColor} card-badge`}
                      >
                        {badgeInfo.icon}
                        <span>{update.type.replace("_", " ")}</span>
                      </div>
                    </div>
                    
                    {/* Owner Actions - Only visible if the current user owns this update */}
                    {isOwner && (
                      <div className="absolute top-4 left-4 z-10 flex space-x-2 owner-actions">
                        <Link 
                          to={`/edit-progress/${update.id}`}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-all text-gray-600 action-button edit-button"
                          title="Edit this update"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDeleteClick(update)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-all text-gray-600 action-button delete-button"
                          title="Delete this update"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-start mb-4">
                        {/* User Avatar */}
                        <div className="flex-shrink-0 mr-4">
                          <div className="relative">
                            <img
                              src={update.user?.profileImageUrl || "/images/placeholder-avatar.png"}
                              alt={update.user?.username || "User"}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://ui-avatars.com/api/?name=" + 
                                  (update.user?.username?.replace(/\s+/g, "+") || "User") + 
                                  "&background=6366f1&color=fff&size=150";
                              }}
                            />
                            <div 
                              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center"
                            >
                              <div className={`w-3.5 h-3.5 rounded-full ${badgeInfo.dotColor}`}></div>
                            </div>
                          </div>
                        </div>
                        
                        {/* User & Update Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-700 line-clamp-1 card-title">
                                <Link to={`/progress/${update.id}`}>
                                  {update.title}
                                </Link>
                              </h3>
                              <p className="text-sm text-gray-500">
                                <span className="font-medium text-gray-900">{update.user?.username || "Anonymous"}</span>
                                <span className="mx-1.5">•</span>
                                <span>{formatDate(update.createdAt)}</span>
                                {isOwner && (
                                  <>
                                    <span className="mx-1.5">•</span>
                                    <span className="text-indigo-600 font-medium">Your post</span>
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Content Preview */}
                      <div className="mb-5">
                        <p className="text-gray-600 line-clamp-3">{update.content}</p>
                      </div>
                      
                      {/* Metrics & Action Row */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                          {update.hoursSpent > 0 && (
                            <div className="flex items-center text-sm text-gray-500">
                              <ClockIcon className="w-4 h-4 mr-1.5 text-gray-400" />
                              <span>{update.hoursSpent} {update.hoursSpent === 1 ? 'hour' : 'hours'}</span>
                            </div>
                          )}
                          
                          {update.rating > 0 && (
                            <div className="flex items-center text-sm text-gray-500">
                              <div className="flex mr-1.5">
                                {[...Array(5)].map((_, i) => (
                                  <StarIcon
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < update.rating
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span>{update.rating}/5</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {isOwner && (
                            <Link
                              to={`/edit-progress/${update.id}`}
                              className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 card-action"
                            >
                              Edit
                              <PencilIcon className="w-3.5 h-3.5 ml-1" />
                            </Link>
                          )}
                          <Link
                            to={`/progress/${update.id}`}
                            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 card-action"
                          >
                            View details
                            <ChevronRightIcon className="w-4 h-4 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        updateTitle={deleteModal.updateTitle}
      />
    </>
  );
};

export default ProgressPage;
