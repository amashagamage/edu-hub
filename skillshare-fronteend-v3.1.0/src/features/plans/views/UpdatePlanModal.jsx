import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import planApi from "../api/planApi";

const UpdatePlanModal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Initial form state
  const initialFormState = {
    title: "",
    description: "",
    category: "",
    skillLevel: "Beginner",
    isPublic: true,
    targetCompletionDate: "",
    estimatedHours: "",
    resources: [""],
    tags: [""],
    learningUnits: [
      {
        title: "",
        description: "",
        orderIndex: 1,
        estimatedHours: "",
        objectives: [""]
      }
    ]
  };

  // Form state
  const [formData, setFormData] = useState(initialFormState);
  
  // Form validation errors
  const [errors, setErrors] = useState({});
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Skill level options
  const skillLevelOptions = ["Beginner", "Intermediate", "Advanced", "Expert"];
  
  // Category options
  const categoryOptions = [
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

  // Validation patterns
  const validationPatterns = {
    title: /^.{5,100}$/,
    description: /^.{10,500}$/,
    estimatedHours: /^[1-9][0-9]*$/,
    targetCompletionDate: /^\d{4}-\d{2}-\d{2}$/,
    url: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
  };

  // Validation messages
  const validationMessages = {
    title: "Title must be between 5 and 100 characters",
    description: "Description must be between 10 and 500 characters",
    estimatedHours: "Estimated hours must be a positive number",
    targetCompletionDate: "Please enter a valid date in format YYYY-MM-DD",
    category: "Please select a category",
    skillLevel: "Please select a skill level",
    url: "Please enter a valid URL",
    unitTitle: "Unit title must be between 5 and 100 characters",
    unitDescription: "Unit description must be between 10 and 500 characters",
    unitEstimatedHours: "Unit estimated hours must be a positive number",
    objective: "Objective must not be empty",
    tag: "Tag must not be empty"
  };

  // Fetch plan data on component mount
  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const plan = await planApi.getLearningPlanById(id);
        
        // Transform the plan data to match our form structure
        const transformedData = {
          title: plan.title || "",
          description: plan.description || "",
          category: plan.category || "",
          skillLevel: plan.skillLevel || "Beginner",
          isPublic: plan.isPublic !== undefined ? plan.isPublic : true,
          targetCompletionDate: plan.targetCompletionDate || "",
          estimatedHours: plan.estimatedHours || "",
          resources: plan.resources && plan.resources.length > 0 ? plan.resources : [""],
          tags: plan.tags && plan.tags.length > 0 ? plan.tags : [""],
          learningUnits: plan.learningUnits && plan.learningUnits.length > 0 
            ? plan.learningUnits.map(unit => ({
                ...unit,
                objectives: unit.objectives && unit.objectives.length > 0 ? unit.objectives : [""]
              }))
            : [{
                title: "",
                description: "",
                orderIndex: 1,
                estimatedHours: "",
                objectives: [""]
              }]
        };
        
        setFormData(transformedData);
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to load plan data");
        setIsLoading(false);
      }
    };
    
    fetchPlanData();
  }, [id]);

  // Handle form input changes
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

  // Handle resource URL changes
  const handleResourceChange = (index, value) => {
    const updatedResources = [...formData.resources];
    updatedResources[index] = value;
    setFormData({
      ...formData,
      resources: updatedResources
    });
    
    // Clear error for this resource if it exists
    if (errors[`resource_${index}`]) {
      setErrors({
        ...errors,
        [`resource_${index}`]: null
      });
    }
  };

  // Add a new resource field
  const addResource = () => {
    setFormData({
      ...formData,
      resources: [...formData.resources, ""]
    });
  };

  // Remove a resource field
  const removeResource = (index) => {
    const updatedResources = formData.resources.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      resources: updatedResources
    });
    
    // Remove any errors associated with this resource
    const updatedErrors = { ...errors };
    delete updatedErrors[`resource_${index}`];
    setErrors(updatedErrors);
  };

  // Handle tag changes
  const handleTagChange = (index, value) => {
    const updatedTags = [...formData.tags];
    updatedTags[index] = value;
    setFormData({
      ...formData,
      tags: updatedTags
    });
    
    // Clear error for this tag if it exists
    if (errors[`tag_${index}`]) {
      setErrors({
        ...errors,
        [`tag_${index}`]: null
      });
    }
  };

  // Add a new tag field
  const addTag = () => {
    setFormData({
      ...formData,
      tags: [...formData.tags, ""]
    });
  };

  // Remove a tag field
  const removeTag = (index) => {
    const updatedTags = formData.tags.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      tags: updatedTags
    });
    
    // Remove any errors associated with this tag
    const updatedErrors = { ...errors };
    delete updatedErrors[`tag_${index}`];
    setErrors(updatedErrors);
  };

  // Handle learning unit changes
  const handleUnitChange = (index, field, value) => {
    const updatedUnits = [...formData.learningUnits];
    updatedUnits[index] = {
      ...updatedUnits[index],
      [field]: value
    };
    setFormData({
      ...formData,
      learningUnits: updatedUnits
    });
    
    // Clear error for this unit field if it exists
    if (errors[`unit_${index}_${field}`]) {
      setErrors({
        ...errors,
        [`unit_${index}_${field}`]: null
      });
    }
  };

  // Add a new learning unit
  const addLearningUnit = () => {
    const newOrderIndex = formData.learningUnits.length + 1;
    setFormData({
      ...formData,
      learningUnits: [
        ...formData.learningUnits,
        {
          title: "",
          description: "",
          orderIndex: newOrderIndex,
          estimatedHours: "",
          objectives: [""]
        }
      ]
    });
  };

  // Remove a learning unit
  const removeLearningUnit = (index) => {
    if (formData.learningUnits.length === 1) {
      toast.error("You must have at least one learning unit");
      return;
    }
    
    const updatedUnits = formData.learningUnits.filter((_, i) => i !== index);
    // Update orderIndex for remaining units
    updatedUnits.forEach((unit, i) => {
      unit.orderIndex = i + 1;
    });
    
    setFormData({
      ...formData,
      learningUnits: updatedUnits
    });
    
    // Remove any errors associated with this unit
    const updatedErrors = { ...errors };
    Object.keys(updatedErrors).forEach(key => {
      if (key.startsWith(`unit_${index}`)) {
        delete updatedErrors[key];
      }
    });
    setErrors(updatedErrors);
  };

  // Handle objective changes for a learning unit
  const handleObjectiveChange = (unitIndex, objectiveIndex, value) => {
    const updatedUnits = [...formData.learningUnits];
    updatedUnits[unitIndex].objectives[objectiveIndex] = value;
    setFormData({
      ...formData,
      learningUnits: updatedUnits
    });
    
    // Clear error for this objective if it exists
    if (errors[`unit_${unitIndex}_objective_${objectiveIndex}`]) {
      setErrors({
        ...errors,
        [`unit_${unitIndex}_objective_${objectiveIndex}`]: null
      });
    }
  };

  // Add a new objective to a learning unit
  const addObjective = (unitIndex) => {
    const updatedUnits = [...formData.learningUnits];
    updatedUnits[unitIndex].objectives.push("");
    setFormData({
      ...formData,
      learningUnits: updatedUnits
    });
  };

  // Remove an objective from a learning unit
  const removeObjective = (unitIndex, objectiveIndex) => {
    if (formData.learningUnits[unitIndex].objectives.length === 1) {
      toast.error("Each learning unit must have at least one objective");
      return;
    }
    
    const updatedUnits = [...formData.learningUnits];
    updatedUnits[unitIndex].objectives = updatedUnits[unitIndex].objectives.filter((_, i) => i !== objectiveIndex);
    
    setFormData({
      ...formData,
      learningUnits: updatedUnits
    });
    
    // Remove any errors associated with this objective
    const updatedErrors = { ...errors };
    delete updatedErrors[`unit_${unitIndex}_objective_${objectiveIndex}`];
    setErrors(updatedErrors);
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    // Validate main fields
    if (!validationPatterns.title.test(formData.title)) {
      newErrors.title = validationMessages.title;
    }
    
    if (!validationPatterns.description.test(formData.description)) {
      newErrors.description = validationMessages.description;
    }
    
    if (!formData.category) {
      newErrors.category = validationMessages.category;
    }
    
    if (!formData.skillLevel) {
      newErrors.skillLevel = validationMessages.skillLevel;
    }
    
    if (!validationPatterns.estimatedHours.test(formData.estimatedHours)) {
      newErrors.estimatedHours = validationMessages.estimatedHours;
    }
    
    if (formData.targetCompletionDate && !validationPatterns.targetCompletionDate.test(formData.targetCompletionDate)) {
      newErrors.targetCompletionDate = validationMessages.targetCompletionDate;
    }
    
    // Validate resources
    formData.resources.forEach((resource, index) => {
      if (resource && !validationPatterns.url.test(resource)) {
        newErrors[`resource_${index}`] = validationMessages.url;
      }
    });
    
    // Validate tags
    formData.tags.forEach((tag, index) => {
      if (!tag.trim()) {
        newErrors[`tag_${index}`] = validationMessages.tag;
      }
    });
    
    // Validate learning units
    formData.learningUnits.forEach((unit, unitIndex) => {
      if (!validationPatterns.title.test(unit.title)) {
        newErrors[`unit_${unitIndex}_title`] = validationMessages.unitTitle;
      }
      
      if (!validationPatterns.description.test(unit.description)) {
        newErrors[`unit_${unitIndex}_description`] = validationMessages.unitDescription;
      }
      
      if (!validationPatterns.estimatedHours.test(unit.estimatedHours)) {
        newErrors[`unit_${unitIndex}_estimatedHours`] = validationMessages.unitEstimatedHours;
      }
      
      // Validate objectives
      unit.objectives.forEach((objective, objectiveIndex) => {
        if (!objective.trim()) {
          newErrors[`unit_${unitIndex}_objective_${objectiveIndex}`] = validationMessages.objective;
        }
      });
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
      // Filter out empty resources and tags
      const filteredResources = formData.resources.filter(r => r.trim());
      const filteredTags = formData.tags.filter(t => t.trim());
      
      // Prepare data for API submission
      const submissionData = {
        ...formData,
        resources: filteredResources,
        tags: filteredTags,
        learningUnits: formData.learningUnits.map(unit => ({
          ...unit,
          objectives: unit.objectives.filter(o => o.trim())
        }))
      };
      
      // Call API to update the plan
      await planApi.updateLearningPlan(id, submissionData);
      
      toast.success("Learning plan updated successfully!");
      navigate(`/plans/${id}`); // Redirect to plan details page
    } catch (error) {
      toast.error(error.message || "Failed to update learning plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="relative">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Update Learning Plan</h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-indigo-700 border-b border-indigo-200 pb-2">
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., Introduction to Python Programming"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Provide a detailed description of your learning plan"
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select a category</option>
                  {categoryOptions.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill Level <span className="text-red-500">*</span>
                </label>
                <select
                  name="skillLevel"
                  value={formData.skillLevel}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.skillLevel ? 'border-red-500' : 'border-gray-300'}`}
                >
                  {skillLevelOptions.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                {errors.skillLevel && (
                  <p className="text-red-500 text-xs mt-1">{errors.skillLevel}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Hours <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="estimatedHours"
                  value={formData.estimatedHours}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-md ${errors.estimatedHours ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="e.g., 50"
                />
                {errors.estimatedHours && (
                  <p className="text-red-500 text-xs mt-1">{errors.estimatedHours}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Completion Date
                </label>
                <input
                  type="date"
                  name="targetCompletionDate"
                  value={formData.targetCompletionDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.targetCompletionDate ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.targetCompletionDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.targetCompletionDate}</p>
                )}
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Make this learning plan public</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Tags Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-blue-700 border-b border-blue-200 pb-2">
              Tags
            </h3>
            
            <div className="space-y-3">
              {formData.tags.map((tag, index) => (
                <div key={`tag-${index}`} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleTagChange(index, e.target.value)}
                    className={`flex-grow px-3 py-2 border rounded-md ${errors[`tag_${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g., Python, Programming, Beginner"
                  />
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remove tag"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {errors[`tag_${index}`] && (
                    <p className="text-red-500 text-xs">{errors[`tag_${index}`]}</p>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addTag}
                className="inline-flex items-center px-3 py-1 border border-blue-300 text-sm leading-5 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Tag
              </button>
            </div>
          </div>
          
          {/* Resources Section */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-green-700 border-b border-green-200 pb-2">
              Resources
            </h3>
            
            <div className="space-y-3">
              {formData.resources.map((resource, index) => (
                <div key={`resource-${index}`} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={resource}
                    onChange={(e) => handleResourceChange(index, e.target.value)}
                    className={`flex-grow px-3 py-2 border rounded-md ${errors[`resource_${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g., https://docs.python.org/3/tutorial/index.html"
                  />
                  <button
                    type="button"
                    onClick={() => removeResource(index)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remove resource"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {errors[`resource_${index}`] && (
                    <p className="text-red-500 text-xs">{errors[`resource_${index}`]}</p>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addResource}
                className="inline-flex items-center px-3 py-1 border border-green-300 text-sm leading-5 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Resource
              </button>
            </div>
          </div>
          
          {/* Learning Units Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Learning Units</h3>
            
            {formData.learningUnits.map((unit, unitIndex) => (
              <div key={`unit-${unitIndex}`} className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-amber-800">
                    Unit {unitIndex + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removeLearningUnit(unitIndex)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remove unit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={unit.title}
                      onChange={(e) => handleUnitChange(unitIndex, 'title', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md ${errors[`unit_${unitIndex}_title`] ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g., Getting Started with Python"
                    />
                    {errors[`unit_${unitIndex}_title`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`unit_${unitIndex}_title`]}</p>
                    )}
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={unit.description}
                      onChange={(e) => handleUnitChange(unitIndex, 'description', e.target.value)}
                      rows="2"
                      className={`w-full px-3 py-2 border rounded-md ${errors[`unit_${unitIndex}_description`] ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Describe what will be covered in this unit"
                    ></textarea>
                    {errors[`unit_${unitIndex}_description`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`unit_${unitIndex}_description`]}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estimated Hours <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={unit.estimatedHours}
                      onChange={(e) => handleUnitChange(unitIndex, 'estimatedHours', e.target.value)}
                      min="1"
                      className={`w-full px-3 py-2 border rounded-md ${errors[`unit_${unitIndex}_estimatedHours`] ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g., 5"
                    />
                    {errors[`unit_${unitIndex}_estimatedHours`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`unit_${unitIndex}_estimatedHours`]}</p>
                    )}
                  </div>
                </div>
                
                {/* Objectives section */}
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Learning Objectives <span className="text-red-500">*</span>
                  </h5>
                  
                  <div className="space-y-2 mb-2">
                    {unit.objectives.map((objective, objectiveIndex) => (
                      <div key={`objective-${unitIndex}-${objectiveIndex}`} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={objective}
                          onChange={(e) => handleObjectiveChange(unitIndex, objectiveIndex, e.target.value)}
                          className={`flex-grow px-3 py-2 border rounded-md ${errors[`unit_${unitIndex}_objective_${objectiveIndex}`] ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="e.g., Understand basic syntax and data types"
                        />
                        <button
                          type="button"
                          onClick={() => removeObjective(unitIndex, objectiveIndex)}
                          className="text-red-500 hover:text-red-700"
                          aria-label="Remove objective"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                          </svg>
                        </button>
                        {errors[`unit_${unitIndex}_objective_${objectiveIndex}`] && (
                          <p className="text-red-500 text-xs">{errors[`unit_${unitIndex}_objective_${objectiveIndex}`]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => addObjective(unitIndex)}
                    className="inline-flex items-center px-2 py-1 border border-amber-300 text-xs leading-4 font-medium rounded-md text-amber-700 bg-amber-100 hover:bg-amber-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Objective
                  </button>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addLearningUnit}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Learning Unit
            </button>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end space-x-3 border-t pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : "Update Learning Plan"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdatePlanModal;