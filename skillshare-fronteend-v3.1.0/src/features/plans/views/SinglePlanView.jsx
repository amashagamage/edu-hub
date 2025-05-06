import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import planApi from "../api/planApi";

const SinglePlanView = () => {
  const currentUserId = localStorage.getItem("userId");
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const fetchedPlan = await planApi.getLearningPlanById(planId);
        setPlan(fetchedPlan);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load plan");
        setLoading(false);
      }
    };

    fetchPlan();
  }, [planId]);

  const handleDelete = async (planId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this learning plan?");
    
    if (confirmDelete) {
      try {
        await planApi.deleteLearningPlan(planId);
       
        console.log("Learning plan deleted successfully.");
        window.location.href="/plans"
      } catch (error) {
     
        console.error("Error deleting learning plan:", error);
      }
    } else {
      console.log("Delete action was canceled.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-medium text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-lg font-medium">{error}</div>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 bg-gradient-to-tr from-blue-50 via-indigo-50 to-white min-h-screen">
      {/* Plan Header */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-indigo-100">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">{plan.title}</h1>
        <p className="text-sm text-gray-500">Created on: {new Date(plan.createdAt).toLocaleDateString()}</p>
        <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{plan.category}</span>
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">{plan.skillLevel}</span>
        </div>
      </div>
  
      {/* Description */}
      <section className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">📝 Description</h2>
        <p className="text-gray-700">{plan.description}</p>
      </section>
  
      {/* Learning Units */}
      <section className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">📚 Learning Units</h2>
        <div className="grid gap-5">
          {plan.learningUnits.map((unit) => (
            <div
              key={unit.unitId}
              className="p-4 rounded-xl border border-gray-200 bg-gray-50 hover:shadow-sm transition"
            >
              <h3 className="text-lg font-bold text-gray-700">{unit.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{unit.description}</p>
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>⏱ {unit.estimatedHours} hrs</span>
                <span>
                  ✅{" "}
                  <span className={unit.completed ? "text-green-600" : "text-red-500"}>
                    {unit.completed ? "Completed" : "Not Completed"}
                  </span>
                </span>
              </div>
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                {unit.objectives.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
  
      {/* Tags */}
      <section className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">🏷️ Tags</h2>
        <div className="flex flex-wrap gap-2">
          {plan.tags.map((tag, i) => (
            <span key={i} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>
      </section>
  
      {/* Resources */}
      <section className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">🔗 Resources</h2>
        {plan.resources.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700">
            {plan.resources.map((r, i) => (
              <li key={i}>
                <a href={r} className="text-blue-500 hover:underline" target="_blank" rel="noreferrer">
                  {r}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No resources available.</p>
        )}
      </section>
  
      {/* Owner */}
      <section className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">👤 Owner</h2>
        <div className="flex items-center gap-4">
          <img
            src={plan.owner.profileImageUrl || "https://via.placeholder.com/40"}
            alt={plan.owner.username}
            className="w-14 h-14 rounded-full object-cover border"
          />
          <div>
            <p className="font-bold text-gray-800">
              {plan.owner.firstName} {plan.owner.lastName}
            </p>
            <p className="text-sm text-gray-500">@{plan.owner.username}</p>
          </div>
        </div>
      </section>
  
      {/* Footer / Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex justify-between items-center">
        <div className="text-sm text-gray-600 space-y-1">
          <p>👁️ {plan.viewCount} views | 🍴 {plan.forkCount} forks</p>
          <p>✅ {plan.completionPercentage.toFixed(2)}% complete</p>
        </div>
        {currentUserId === plan.owner.id && (
          <div className="flex gap-3">
            <Link
              to={`/edit-plan/${plan.id}`}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm shadow"
            >
              Edit
            </Link>
            <button
              onClick={() => handleDelete(plan.id)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm shadow"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default SinglePlanView;
