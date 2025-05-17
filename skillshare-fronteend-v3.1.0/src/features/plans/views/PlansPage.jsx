import { useEffect, useState, useRef } from "react";
import planApi from "../api/planApi";
import PlanList from "./PlanList";
import { Link } from "react-router-dom";
import { Search, Filter, Plus, Book, BookOpen, Clock, TrendingUp, ArrowDownAZ, Sparkles, Menu } from "lucide-react";

const PlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSkillLevel, setSelectedSkillLevel] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef(null);

  // Available filter options
  const categories = [
    "All", 
    "Programming", 
    "Web Development", 
    "Data Science", 
    "Machine Learning", 
    "DevOps", 
    "Mobile Development", 
    "Database", 
    "Cloud Computing", 
    "Other"
  ];
  
  const skillLevels = ["All", "Beginner", "Intermediate", "Advanced", "Expert"];
  
  const sortOptions = [
    { id: "newest", label: "Newest First", icon: Clock },
    { id: "popular", label: "Most Popular", icon: TrendingUp },
    { id: "alphabetical", label: "Alphabetical", icon: ArrowDownAZ },
  ];

  // Handle clicking outside the filter menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setFilterMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchPlans = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await planApi.getPublicLearningPlans();
      setPlans(response.content);
      setFilteredPlans(response.content);
    } catch (error) {
      console.error(error);
      setError("Failed to load learning plans. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...plans];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        plan => 
          plan.title.toLowerCase().includes(query) || 
          plan.description.toLowerCase().includes(query) ||
          plan.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter(plan => plan.category === selectedCategory);
    }
    
    // Filter by skill level
    if (selectedSkillLevel !== "All") {
      result = result.filter(plan => plan.skillLevel === selectedSkillLevel);
    }
    
    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "popular":
        result.sort((a, b) => b.likesCount - a.likesCount);
        break;
      case "alphabetical":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    
    setFilteredPlans(result);
  }, [plans, searchQuery, selectedCategory, selectedSkillLevel, sortBy]);

  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-green-50 min-h-screen pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12 px-6 shadow-lg rounded-b-3xl mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-4xl font-bold mb-2">Learning Plans</h1>
              <p className="text-green-100 max-w-xl">
                Discover expert-crafted learning paths to master new skills. Find plans that match your goals or create your own to share with the community.
              </p>
            </div>
            <Link 
              to="/create-plan" 
              className="flex items-center space-x-2 bg-white text-green-700 font-bold py-3 px-6 rounded-lg hover:bg-green-50 transition-all shadow-md transform hover:scale-105"
            >
              <Plus size={20} />
              <span>Create Plan</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-md flex items-center">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <Book className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Plans</p>
              <p className="text-2xl font-bold text-gray-800">{plans.length}</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-md flex items-center">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Most Popular</p>
              <p className="text-2xl font-bold text-gray-800">{selectedCategory !== "All" ? selectedCategory : "All Categories"}</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-md flex items-center">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <Sparkles className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">New This Week</p>
              <p className="text-2xl font-bold text-gray-800">{Math.min(5, plans.length)}</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search plans by title, description, or tags..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters - Desktop */}
            <div className="hidden md:flex space-x-2">
              {/* Category Dropdown */}
              <select
                className="border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Skill Level Dropdown */}
              <select
                className="border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={selectedSkillLevel}
                onChange={(e) => setSelectedSkillLevel(e.target.value)}
              >
                {skillLevels.map(level => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>

              {/* Sort By Dropdown */}
              <select
                className="border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Filter Button */}
            <div className="md:hidden relative">
              <button
                onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                className="flex items-center justify-center w-full space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200"
              >
                <Filter size={18} />
                <span>Filters</span>
              </button>

              {/* Mobile Filters Modal */}
              {filterMenuOpen && (
                <div 
                  ref={filterMenuRef}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 p-4 space-y-3 border border-gray-200"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skill Level
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={selectedSkillLevel}
                      onChange={(e) => setSelectedSkillLevel(e.target.value)}
                    >
                      {skillLevels.map(level => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sort By
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      {sortOptions.map(option => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading, Error and Results */}
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-lg shadow-md">
            <Book className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No plans found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filters, or create a new plan.
            </p>
            <Link 
              to="/create-plan" 
              className="mt-4 inline-flex items-center space-x-2 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus size={16} />
              <span>Create Plan</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-700 font-medium">
                Showing <span className="font-bold text-green-700">{filteredPlans.length}</span> 
                {filteredPlans.length !== plans.length && (
                  <> out of <span className="font-bold">{plans.length}</span></>
                )} plans
              </p>
              
              {(selectedCategory !== "All" || selectedSkillLevel !== "All" || searchQuery) && (
                <button 
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedSkillLevel("All");
                    setSearchQuery("");
                  }}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
            
            <PlanList plans={filteredPlans} />
          </>
        )}
      </div>
    </div>
  );
};

export default PlansPage;