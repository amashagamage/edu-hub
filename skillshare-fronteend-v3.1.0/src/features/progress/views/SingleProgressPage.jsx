import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Clock, 
  Star, 
  CalendarDays, 
  User, 
  ChevronLeft, 
  Edit,
  Trash2
} from 'lucide-react';
import ProgressUpdateApi from '../api/progressApi';

const SingleProgressPage = () => {
  const { progressId } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  
  // Progress update data
  const [progressUpdate, setProgressUpdate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch progress update
  useEffect(() => {
    const fetchProgressUpdate = async () => {
      try {
        setIsLoading(true);
        const data = await ProgressUpdateApi.getProgressUpdateById(progressId);
        setProgressUpdate(data);
      } catch (err) {
        console.error('Error fetching progress update:', err);
        setError('Failed to load progress update. Please try again later.');
        toast.error('Failed to load progress update');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProgressUpdate();
  }, [progressId]);
  
  // Handle delete
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this progress update?')) {
      try {
        await ProgressUpdateApi.deleteProgressUpdate(progressId);
        toast.success('Progress update deleted successfully');
        navigate('/progress');
      } catch (err) {
        console.error('Error deleting progress update:', err);
        toast.error('Failed to delete progress update');
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4 text-xl">{error}</div>
        <button 
          onClick={() => navigate('/progress')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Back to Progress
        </button>
      </div>
    );
  }

  if (!progressUpdate) return null;

  const isOwner = userId === progressUpdate.userId;

  // Get badge color based on type
  const getBadgeColor = (type) => {
    switch (type) {
      case "MILESTONE":
        return {
          bgColor: "bg-purple-100",
          textColor: "text-purple-800",
          icon: <Star className="w-4 h-4 text-purple-600" />
        };
      case "DAILY_UPDATE":
        return {
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          icon: <CalendarDays className="w-4 h-4 text-blue-600" />
        };
      case "CHALLENGE":
        return {
          bgColor: "bg-orange-100",
          textColor: "text-orange-800",
          icon: <CalendarDays className="w-4 h-4 text-orange-600" />
        };
      default:
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          icon: <CalendarDays className="w-4 h-4 text-gray-600" />
        };
    }
  };

  const badgeColors = getBadgeColor(progressUpdate.type);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Back button */}
      <div className="px-6 pt-6">
        <button 
          onClick={() => navigate('/progress')}
          className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Progress</span>
        </button>
      </div>
      
      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">{progressUpdate.title}</h1>
            <div className="flex items-center text-gray-500 text-sm mb-4">
              <div className="mr-3 flex items-center">
                <div className="h-8 w-8 rounded-full overflow-hidden mr-2 ring-2 ring-indigo-100">
                  <img 
                    src={progressUpdate.user?.profileImageUrl || "/images/placeholder-avatar.png"} 
                    alt={progressUpdate.user?.username || 'Anonymous'}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://ui-avatars.com/api/?name=" + 
                        (progressUpdate.user?.username?.replace(/\s+/g, "+") || "User") + 
                        "&background=6366f1&color=fff&size=150";
                    }}
                  />
                </div>
                <span className="font-medium">{progressUpdate.user?.username || 'Anonymous'}</span>
              </div>
              <Clock className="w-4 h-4 mr-1" />
              <span>{formatDate(progressUpdate.createdAt)}</span>
            </div>
          </div>
          
          {/* Type badge */}
          <div className={`${badgeColors.bgColor} ${badgeColors.textColor} px-3 py-1 rounded-full flex items-center text-sm font-medium`}>
            {badgeColors.icon}
            <span className="ml-1">{progressUpdate.type.replace('_', ' ')}</span>
          </div>
        </div>
        
        {/* Owner actions */}
        {isOwner && (
          <div className="flex justify-end space-x-2 mb-4">
            <button
              onClick={() => navigate(`/edit-progress/${progressId}`)}
              className="flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="px-6 py-4">
        <div className="prose max-w-none">
          <p className="whitespace-pre-line">{progressUpdate.content}</p>
        </div>
        
        {/* Stats */}
        <div className="mt-6 flex flex-wrap gap-6">
          {progressUpdate.hoursSpent > 0 && (
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-indigo-600 mr-2" />
              <div>
                <div className="text-sm text-gray-500">Hours Spent</div>
                <div className="font-medium">{progressUpdate.hoursSpent}</div>
              </div>
            </div>
          )}
          
          {progressUpdate.rating > 0 && (
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              <div>
                <div className="text-sm text-gray-500">Self-Rating</div>
                <div className="font-medium flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < progressUpdate.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Achievements and Challenges */}
        <div className="mt-8 grid md:grid-cols-2 gap-8">
          {progressUpdate.achievements?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Star className="w-5 h-5 text-green-500 mr-2" />
                Achievements
              </h3>
              <ul className="space-y-2">
                {progressUpdate.achievements.map((achievement, idx) => (
                  <li key={idx} className="pl-3 border-l-2 border-green-400">
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {progressUpdate.challenges?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Star className="w-5 h-5 text-red-500 mr-2" />
                Challenges
              </h3>
              <ul className="space-y-2">
                {progressUpdate.challenges.map((challenge, idx) => (
                  <li key={idx} className="pl-3 border-l-2 border-red-400">
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleProgressPage;