  <h1 className="text-3xl font-bold text-green-600 mb-6">Create Progress Update</h1>
  
  <form onSubmit={handleSubmit} className="space-y-6 bg-white/90 p-8 rounded-xl shadow-lg border border-gray-100">
    {/* Basic Information */}
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center">
        <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
        Basic Information
      </h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'} focus:ring-green-500 focus:border-green-500 shadow-sm`}
          placeholder="What did you work on?"
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
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
          className={`w-full px-3 py-2 border rounded-md ${errors.content ? 'border-red-500' : 'border-gray-300'} focus:ring-green-500 focus:border-green-500 shadow-sm`}
          placeholder="Describe your progress in detail..."
        ></textarea>
        {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hours Spent <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="hoursSpent"
              value={formData.hoursSpent}
              onChange={handleInputChange}
              min="1"
              className={`w-full pl-10 pr-3 py-2 border rounded-md ${errors.hoursSpent ? 'border-red-500' : 'border-gray-300'} focus:ring-green-500 focus:border-green-500 shadow-sm`}
              placeholder="e.g., 3"
            />
          </div>
          {errors.hoursSpent && <p className="text-red-500 text-xs mt-1">{errors.hoursSpent}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Progress Type <span className="text-red-500">*</span>
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.type ? 'border-red-500' : 'border-gray-300'} focus:ring-green-500 focus:border-green-500 shadow-sm`}
          >
            <option value="">Select a type</option>
            {progressTypes.map(type => (
              <option key={type} value={type}>{type.replace('_', ' ').toLowerCase()}</option>
            ))}
          </select>
          {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rating (1-5)
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => handleInputChange({ target: { name: 'rating', value: num.toString() } })}
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  parseInt(formData.rating) === num 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {num}
              </button>
            ))}
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 shadow-sm"
          >
            <option value="">Select your feeling</option>
            {sentiments.map(sentiment => (
              <option key={sentiment} value={sentiment}>{sentiment.toLowerCase()}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          name="isPublic"
          checked={formData.isPublic}
          onChange={handleInputChange}
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700">
          Make this progress update public
        </label>
      </div>
    </div>
    
    {/* Learning Plan Selection */}
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center">
        <Book className="mr-2 h-5 w-5 text-green-600" />
        Learning Plan
      </h2>
      
      {isLoadingPlans ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Learning Plan
            </label>
            <select
              name="relatedPlanId"
              value={formData.relatedPlanId}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.relatedPlanId ? 'border-red-500' : 'border-gray-300'} focus:ring-green-500 focus:border-green-500 shadow-sm`}
            >
              <option value="">Select a plan (optional)</option>
              {plans.map(plan => (
                <option key={plan.id} value={plan.id}>{plan.title}</option>
              ))}
            </select>
            {errors.relatedPlanId && <p className="text-red-500 text-xs mt-1">{errors.relatedPlanId}</p>}
          </div>
          
          {formData.relatedPlanId && units.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Learning Unit (optional)
              </label>
              <select
                name="learningUnitId"
                value={formData.learningUnitId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.learningUnitId ? 'border-red-500' : 'border-gray-300'} focus:ring-green-500 focus:border-green-500 shadow-sm`}
              >
                <option value="">Select a unit</option>
                {units.map(unit => (
                  <option key={unit.unitId} value={unit.unitId}>{unit.title}</option>
                ))}
              </select>
              {errors.learningUnitId && <p className="text-red-500 text-xs mt-1">{errors.learningUnitId}</p>}
            </div>
          )}
        </>
      )}
    </div>
    
    {/* Challenges */}
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center">
        <X className="mr-2 h-5 w-5 text-red-600" />
        Challenges Faced
      </h2>
      
      {formData.challenges.map((challenge, index) => (
        <div key={`challenge-${index}`} className="flex items-center space-x-2">
          <input
            type="text"
            value={challenge}
            onChange={(e) => handleListChange('challenges', index, e.target.value)}
            className={`flex-1 px-3 py-2 border rounded-md ${errors[`challenges_${index}`] ? 'border-red-500' : 'border-gray-300'} focus:ring-green-500 focus:border-green-500 shadow-sm`}
            placeholder="What challenges did you face?"
          />
          <button
            type="button"
            onClick={() => removeListItem('challenges', index)}
            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
          >
            <X className="h-5 w-5" />
          </button>
          {errors[`challenges_${index}`] && (
            <p className="text-red-500 text-xs">{errors[`challenges_${index}`]}</p>
          )}
        </div>
      ))}
      
      <button
        type="button"
        onClick={() => addListItem('challenges')}
        className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Challenge
      </button>
    </div>
    
    {/* Achievements */}
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 flex items-center">
        <Award className="mr-2 h-5 w-5 text-green-600" />
        Achievements
      </h2>
      
      {formData.achievements.map((achievement, index) => (
        <div key={`achievement-${index}`} className="flex items-center space-x-2">
          <input
            type="text"
            value={achievement}
            onChange={(e) => handleListChange('achievements', index, e.target.value)}
            className={`flex-1 px-3 py-2 border rounded-md ${errors[`achievements_${index}`] ? 'border-red-500' : 'border-gray-300'} focus:ring-green-500 focus:border-green-500 shadow-sm`}
            placeholder="What did you accomplish?"
          />
          <button
            type="button"
            onClick={() => removeListItem('achievements', index)}
            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
          >
            <X className="h-5 w-5" />
          </button>
          {errors[`achievements_${index}`] && (
            <p className="text-red-500 text-xs">{errors[`achievements_${index}`]}</p>
          )}
        </div>
      ))}
      
      <button
        type="button"
        onClick={() => addListItem('achievements')}
        className="inline-flex items-center px-3 py-2 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Achievement
      </button>
    </div>
    
    {/* Submit Button */}
    <div className="flex justify-end space-x-3 pt-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        type="submit"
        className={`px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating...
          </span>
        ) : (
          <span className="flex items-center">
            <Save className="h-4 w-4 mr-2" />
            Create Progress Update
          </span>
        )}
      </button>
    </div>
  </form> 