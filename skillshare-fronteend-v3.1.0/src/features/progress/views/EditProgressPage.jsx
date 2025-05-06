import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProgressUpdateApi from '../api/progressApi';
import planApi from '../../plans/api/planApi';
import { 
  ClockIcon, 
  PlusCircleIcon,
  XCircleIcon,
  SaveIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  StarIcon,
  TrophyIcon,
  PencilIcon,
  ActivityIcon,
  BookmarkIcon,
  AlertCircleIcon,
  GlobeIcon,
  LockIcon
} from 'lucide-react';

const EditProgressPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPublic: true,
    hoursSpent: '',
    type: '',
    rating: '',
    sentiment: '',
    challenges: [''],
    achievements: [''],
    relatedPlanId: '',
    learningUnitId: '',
    userId: currentUserId
  });

  // UI state
  const [plans, setPlans] = useState([]);
  const [units, setUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Progress types and sentiments
  const progressTypes = [
    'MILESTONE',
    'DAILY_UPDATE',
    'CHALLENGE',
    'REFLECTION',
    'STUCK',
    'COMPLETED'
  ];

  const sentiments = [
    'EXCITED',
    'SATISFIED',
    'NEUTRAL',
    'FRUSTRATED',
    'OVERWHELMED'
  ];

  // Validation patterns
  const validationPatterns = {
    title: /^.{5,100}$/,
    content: /^.{10,1000}$/,
    hoursSpent: /^[1-9][0-9]*$/,
    challenge: /^.{3,200}$/,
    achievement: /^.{3,200}$/
  };

  // Validation messages
  const validationMessages = {
    title: "Title must be between 5 and 100 characters",
    content: "Content must be between 10 and 1000 characters",
    hoursSpent: "Hours spent must be a positive number",
    type: "Please select a progress type",
    challenge: "Challenge must be between 3 and 200 characters",
    achievement: "Achievement must be between 3 and 200 characters",
    relatedPlanId: "Please select a learning plan"
  };

  // Fetch progress update and plans on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the progress update to edit
        const progressUpdate = await ProgressUpdateApi.getProgressUpdateById(id);
        
        // Fetch available plans
        const plansResponse = await planApi.getPublicLearningPlans();
        setPlans(plansResponse.content);
        
        // Set form data with the fetched progress update
        setFormData({
          title: progressUpdate.title,
          content: progressUpdate.content,
          isPublic: progressUpdate.isPublic,
          hoursSpent: progressUpdate.hoursSpent.toString(),
          type: progressUpdate.type,
          rating: progressUpdate.rating ? progressUpdate.rating.toString() : '',
          sentiment: progressUpdate.sentiment || '',
          challenges: progressUpdate.challenges.length > 0 ? progressUpdate.challenges : [''],
          achievements: progressUpdate.achievements.length > 0 ? progressUpdate.achievements : [''],
          relatedPlanId: progressUpdate.relatedPlanId || '',
          learningUnitId: progressUpdate.learningUnitId || '',
          userId: currentUserId
        });
        
        // If there's a related plan, fetch its units
        if (progressUpdate.relatedPlanId) {
          const selectedPlan = plansResponse.content.find(p => p.id === progressUpdate.relatedPlanId);
          if (selectedPlan) {
            setUnits(selectedPlan.learningUnits);
          }
        }
      } catch (error) {
        toast.error("Failed to load progress update data");
        navigate('/progress');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id, currentUserId, navigate]);

  // Fetch units when a plan is selected
  useEffect(() => {
    if (formData.relatedPlanId) {
      const selectedPlan = plans.find(plan => plan.id === formData.relatedPlanId);
      if (selectedPlan) {
        setUnits(selectedPlan.learningUnits);
      }
    } else {
      setUnits([]);
    }
  }, [formData.relatedPlanId, plans]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Handle challenge/achievement changes
  const handleListChange = (listName, index, value) => {
    const updatedList = [...formData[listName]];
    updatedList[index] = value;
    setFormData({
      ...formData,
      [listName]: updatedList
    });
    
    // Clear error for this item if it exists
    if (errors[`${listName}_${index}`]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[`${listName}_${index}`];
      setErrors(updatedErrors);
    }
  };

  // Add new challenge/achievement
  const addListItem = (listName) => {
    setFormData({
      ...formData,
      [listName]: [...formData[listName], '']
    });
  };

  // Remove challenge/achievement
  const removeListItem = (listName, index) => {
    if (formData[listName].length <= 1) {
      toast.error(`You must have at least one ${listName.slice(0, -1)}`);
      return;
    }
    
    const updatedList = formData[listName].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [listName]: updatedList
    });
    
    // Remove any errors associated with this item
    const updatedErrors = { ...errors };
    delete updatedErrors[`${listName}_${index}`];
    setErrors(updatedErrors);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Validate required fields
    if (!validationPatterns.title.test(formData.title)) {
      newErrors.title = validationMessages.title;
    }
    
    if (!validationPatterns.content.test(formData.content)) {
      newErrors.content = validationMessages.content;
    }
    
    if (!formData.type) {
      newErrors.type = validationMessages.type;
    }
    
    if (!validationPatterns.hoursSpent.test(formData.hoursSpent)) {
      newErrors.hoursSpent = validationMessages.hoursSpent;
    }
    
    if (formData.relatedPlanId && !formData.learningUnitId) {
      newErrors.learningUnitId = "Please select a learning unit";
    }
    
    // Validate challenges
    formData.challenges.forEach((challenge, index) => {
      if (challenge && !validationPatterns.challenge.test(challenge)) {
        newErrors[`challenges_${index}`] = validationMessages.challenge;
      }
    });
    
    // Validate achievements
    formData.achievements.forEach((achievement, index) => {
      if (achievement && !validationPatterns.achievement.test(achievement)) {
        newErrors[`achievements_${index}`] = validationMessages.achievement;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors before submitting");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Filter out empty challenges and achievements
      const submissionData = {
        ...formData,
        challenges: formData.challenges.filter(c => c.trim()),
        achievements: formData.achievements.filter(a => a.trim()),
        hoursSpent: parseInt(formData.hoursSpent),
        rating: formData.rating ? parseInt(formData.rating) : null
      };
      
      await ProgressUpdateApi.updateProgressUpdate(id, submissionData);
      toast.success("Progress update updated successfully!");
      navigate('/progress'); // Redirect to progress updates page
    } catch (error) {
      toast.error(error.message || "Failed to update progress update");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium">Loading your progress update...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ToastContainer position="top-right" autoClose={3000} />
        
        {/* Breadcrumb navigation */}
        <nav className="flex mb-6 items-center text-sm text-gray-500">
          <Link to="/progress" className="hover:text-indigo-600 flex items-center">
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Back to Progress Updates
          </Link>
        </nav>
        
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center">
              <PencilIcon className="mr-3 h-6 w-6" />
              Edit Progress Update
            </h1>
            <p className="text-indigo-100 max-w-3xl">
              Update your learning progress, document achievements, and track challenges.
            </p>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center p-6 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-100">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3 shadow-sm">
                <BookmarkIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Basic Information</h2>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 text-gray-900 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  placeholder="What did you work on?"
                />
                {errors.title && (
                  <p className="flex items-center text-red-500 text-xs mt-1.5">
                    <AlertCircleIcon className="w-3.5 h-3.5 mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-2.5 text-gray-900 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${errors.content ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  placeholder="Describe your progress in detail..."
                ></textarea>
                {errors.content && (
                  <p className="flex items-center text-red-500 text-xs mt-1.5">
                    <AlertCircleIcon className="w-3.5 h-3.5 mr-1" />
                    {errors.content}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hours Spent <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="hoursSpent"
                      value={formData.hoursSpent}
                      onChange={handleInputChange}
                      min="1"
                      className={`w-full pl-10 pr-4 py-2.5 text-gray-900 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${errors.hoursSpent ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                      placeholder="e.g., 3"
                    />
                  </div>
                  {errors.hoursSpent && (
                    <p className="flex items-center text-red-500 text-xs mt-1.5">
                      <AlertCircleIcon className="w-3.5 h-3.5 mr-1" />
                      {errors.hoursSpent}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Progress Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 text-gray-900 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors appearance-none ${errors.type ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    >
                      <option value="">Select a type</option>
                      {progressTypes.map(type => (
                        <option key={type} value={type}>{type.replace('_', ' ')}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ActivityIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  {errors.type && (
                    <p className="flex items-center text-red-500 text-xs mt-1.5">
                      <AlertCircleIcon className="w-3.5 h-3.5 mr-1" />
                      {errors.type}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating (1-5)
                  </label>
                  <div className="relative">
                    <select
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors appearance-none"
                    >
                      <option value="">Select a rating</option>
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'star' : 'stars'}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <StarIcon className="h-4 w-4 text-yellow-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sentiment
                  </label>
                  <select
                    name="sentiment"
                    value={formData.sentiment}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors appearance-none"
                  >
                    <option value="">How do you feel?</option>
                    {sentiments.map(sentiment => (
                      <option key={sentiment} value={sentiment}>{sentiment.charAt(0) + sentiment.slice(1).toLowerCase()}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3 flex items-center">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 flex items-center text-sm">
                  {formData.isPublic ? (
                    <>
                      <GlobeIcon className="w-4 h-4 mr-1.5 text-green-500" />
                      <span className="text-gray-700">Make this progress update public</span>
                    </>
                  ) : (
                    <>
                      <LockIcon className="w-4 h-4 mr-1.5 text-gray-500" />
                      <span className="text-gray-700">Keep this progress update private</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Learning Plan Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center p-6 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-100">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3 shadow-sm">
                <ActivityIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Learning Plan</h2>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="bg-indigo-50 rounded-lg p-4 mb-4 flex items-start">
                <div className="mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-indigo-700">
                  Linking your progress to a specific learning plan helps track your journey and measure achievements against your goals.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Learning Plan
                </label>
                <div className="relative">
                  <select
                    name="relatedPlanId"
                    value={formData.relatedPlanId}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 text-gray-900 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors appearance-none ${errors.relatedPlanId ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  >
                    <option value="">Select a plan (optional)</option>
                    {plans.map(plan => (
                      <option key={plan.id} value={plan.id}>{plan.title}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                {errors.relatedPlanId && (
                  <p className="flex items-center text-red-500 text-xs mt-1.5">
                    <AlertCircleIcon className="w-3.5 h-3.5 mr-1" />
                    {errors.relatedPlanId}
                  </p>
                )}
              </div>
              
              {formData.relatedPlanId && units.length > 0 && (
                <div className="mt-4 p-4 border border-indigo-100 rounded-lg bg-indigo-50/50">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Learning Unit (optional)
                  </label>
                  <div className="relative">
                    <select
                      name="learningUnitId"
                      value={formData.learningUnitId}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 text-gray-900 bg-white border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors appearance-none ${errors.learningUnitId ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    >
                      <option value="">Select a unit</option>
                      {units.map(unit => (
                        <option key={unit.unitId} value={unit.unitId}>{unit.title}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  {errors.learningUnitId && (
                    <p className="flex items-center text-red-500 text-xs mt-1.5">
                      <AlertCircleIcon className="w-3.5 h-3.5 mr-1" />
                      {errors.learningUnitId}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Challenges */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center p-6 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-100">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3 shadow-sm">
                <AlertCircleIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Challenges Faced</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600 mb-3">
                Document the challenges you encountered during this learning period to track your progress and share insights with others.
              </p>
              
              {formData.challenges.map((challenge, index) => (
                <div key={`challenge-${index}`} className="flex items-center space-x-2 group">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={challenge}
                      onChange={(e) => handleListChange('challenges', index, e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 text-gray-900 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${errors[`challenges_${index}`] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                      placeholder="What challenges did you face?"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeListItem('challenges', index)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Remove challenge"
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                  {errors[`challenges_${index}`] && (
                    <p className="absolute text-xs text-red-500 mt-1 ml-10">{errors[`challenges_${index}`]}</p>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addListItem('challenges')}
                className="inline-flex items-center px-4 py-2 mt-2 bg-white border border-indigo-300 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm"
              >
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                Add Challenge
              </button>
            </div>
          </div>
          
          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center p-6 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-100">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3 shadow-sm">
                <TrophyIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Achievements</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600 mb-3">
                Celebrate your wins and milestones! Document what you've accomplished during this learning period.
              </p>
              
              {formData.achievements.map((achievement, index) => (
                <div key={`achievement-${index}`} className="flex items-center space-x-2 group">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) => handleListChange('achievements', index, e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 text-gray-900 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${errors[`achievements_${index}`] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                      placeholder="What did you accomplish?"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-xs font-medium text-green-600">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeListItem('achievements', index)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Remove achievement"
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                  {errors[`achievements_${index}`] && (
                    <p className="absolute text-xs text-red-500 mt-1 ml-10">{errors[`achievements_${index}`]}</p>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addListItem('achievements')}
                className="inline-flex items-center px-4 py-2 mt-2 bg-white border border-green-300 rounded-lg text-sm font-medium text-green-600 hover:bg-green-50 transition-colors shadow-sm"
              >
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                Add Achievement
              </button>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 sm:flex sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0 sm:pr-6">
                <h3 className="text-lg font-medium text-gray-900 mb-1">Ready to update your progress?</h3>
                <p className="text-sm text-gray-500">
                  Review your changes before submitting. Your progress updates help track your learning journey.
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/progress')}
                  className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm flex items-center"
                  disabled={isSubmitting}
                >
                  <ChevronLeftIcon className="w-4 h-4 mr-1.5" />
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className={`px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg shadow-sm text-sm font-medium text-white transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="w-4 h-4 mr-1.5" />
                      Update Progress
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProgressPage;