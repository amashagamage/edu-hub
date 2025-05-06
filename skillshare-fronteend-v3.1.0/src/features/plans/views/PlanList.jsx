import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, Star, ChevronRight, Bookmark, Calendar, Layers, Flame, Award } from "lucide-react";

const PlanList = ({ plans }) => {
  const navigate = useNavigate();

  // Format estimated duration in a readable way
  const formatDuration = (hours) => {
    if (!hours) return "N/A";
    
    if (hours < 1) {
      return "< 1 hour";
    } else if (hours === 1) {
      return "1 hour";
    } else if (hours < 24) {
      return `${hours} hours`;
    } else {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      if (remainingHours === 0) {
        return days === 1 ? "1 day" : `${days} days`;
      } else {
        return days === 1 
          ? `1 day ${remainingHours} hr` 
          : `${days} days ${remainingHours} hr`;
      }
    }
  };
  
  // Return the appropriate difficulty icon based on skill level
  const getDifficultyIcon = (level) => {
    switch(level) {
      case "Beginner":
        return <div className="bg-green-100 p-1.5 rounded-full"><Layers size={16} className="text-green-600" /></div>;
      case "Intermediate":
        return <div className="bg-blue-100 p-1.5 rounded-full"><Flame size={16} className="text-blue-600" /></div>;
      case "Advanced":
        return <div className="bg-orange-100 p-1.5 rounded-full"><Star size={16} className="text-orange-600" /></div>;
      case "Expert":
        return <div className="bg-purple-100 p-1.5 rounded-full"><Award size={16} className="text-purple-600" /></div>;
      default:
        return <div className="bg-gray-100 p-1.5 rounded-full"><Layers size={16} className="text-gray-600" /></div>;
    }
  };
  
  // Get appropriate color scheme based on completion percentage
  const getProgressColors = (percentage) => {
    if (percentage >= 75) {
      return {
        text: "text-green-700",
        bg: "bg-green-100",
        border: "border-green-300",
        fill: "bg-green-500"
      };
    } else if (percentage >= 50) {
      return {
        text: "text-blue-700",
        bg: "bg-blue-100",
        border: "border-blue-300",
        fill: "bg-blue-500"
      };
    } else if (percentage >= 25) {
      return {
        text: "text-yellow-700",
        bg: "bg-yellow-100",
        border: "border-yellow-300",
        fill: "bg-yellow-500"
      };
    } else {
      return {
        text: "text-gray-700",
        bg: "bg-gray-100",
        border: "border-gray-300",
        fill: "bg-gray-500"
      };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => {
        const progressColors = getProgressColors(plan.completionPercentage);
        
        return (
          <div
            key={plan.id}
            className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            onClick={() => {
              navigate("/plans/" + plan.id);
            }}
          >
            {/* Header with gradient by category */}
            <div className="relative p-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-xl">
              {/* Skill level badge */}
              <div className="absolute top-4 right-4 flex items-center">
                {getDifficultyIcon(plan.skillLevel)}
              </div>
              
              {/* Title */}
              <h2 className="text-xl font-bold tracking-wide pr-10 mb-1">{plan.title}</h2>
              
              {/* Category & bookmark */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider bg-white/20 px-2 py-1 rounded">
                  {plan.category}
                </span>
                <button 
                  className="text-white/80 hover:text-white" 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add bookmark functionality here
                  }}
                >
                  <Bookmark size={16} />
                </button>
              </div>
            </div>

            {/* Body content */}
            <div className="p-5 flex-grow flex flex-col">
              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                {plan.description}
              </p>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs font-medium ${progressColors.text}`}>
                    Completion
                  </span>
                  <span className={`text-xs font-bold ${progressColors.text}`}>
                    {plan.completionPercentage.toFixed(0)}%
                  </span>
                </div>
                <div className={`w-full h-2 ${progressColors.bg} ${progressColors.border} border rounded-full overflow-hidden`}>
                  <div
                    className={`h-full ${progressColors.fill}`}
                    style={{ width: `${plan.completionPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center">
                  <Clock size={16} className="text-gray-400 mr-2" />
                  <span className="text-xs text-gray-600">
                    {formatDuration(plan.estimatedHours)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="text-gray-400 mr-2" />
                  <span className="text-xs text-gray-600">
                    {new Date(plan.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {plan.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
                {plan.tags.length > 3 && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">
                    +{plan.tags.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Footer with creator info */}
            <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center">
                <img
                  src={
                    plan.owner.profileImageUrl ||
                    "https://via.placeholder.com/40"
                  }
                  alt={plan.owner.username}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
                <div className="ml-2">
                  <p className="text-xs font-medium text-gray-800">
                    {plan.owner.firstName} {plan.owner.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    @{plan.owner.username}
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlanList;

