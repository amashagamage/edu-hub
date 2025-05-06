import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./features/auth/views/Login";
import OAuth2RedirectHandler from "./features/auth/views/OAuth2RedirectHandler";
import RegisterPage from "./features/auth/views/RegisterPage";
import PostPage from "./features/posts/views/PostPage";
import { ToastContainer } from "react-toastify";
import CurrentUserProfilePage from "./features/user/views/CurrentUserProfilePage";
import FollowUserProfile from "./features/user/views/FollowUserProfile";
import NotificationsPage from "./features/notifications/views/NotificationsPage";
import PlansPage from "./features/plans/views/PlansPage";
import CreatePlanModal from "./features/plans/views/CreatePlanModal";
import UpdatePlanModal from "./features/plans/views/UpdatePlanModal";
import SinglePlanView from "./features/plans/views/SinglePlanView";
import ProgressPage from "./features/progress/views/ProgressPage";
import CreateProgressPage from "./features/progress/views/CreateProgressPage";
import EditProgressPage from "./features/progress/views/EditProgressPage";
import SingleProgressPage from "./features/progress/views/SingleProgressPage";
import ChatHomePage from "./features/chat/views/ChatHomePage";
import ProfileImageTest from "./features/user/views/ProfileImageTest";

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 text-gray-800">
      <BrowserRouter>
        {/* NAVBAR - Removed fixed container to let the new Navbar component handle its own styling */}
        <Navbar />

        {/* MAIN CONTENT - Adjusted padding for better spacing with the new navbar */}
        <div className="pt-6 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-7xl mx-auto pb-16">
          <Routes>
            {/* AUTH ROUTES */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="/login/oauth2/code/google" element={<OAuth2RedirectHandler />} />

            {/* POST ROUTES */}
            <Route path="/" element={<PostPage />} />

            {/* USER ROUTES */}
            <Route path="/profile" element={<CurrentUserProfilePage />} />
            <Route path="/profile/:id" element={<FollowUserProfile />} />
            <Route path="/profile-image-test" element={<ProfileImageTest />} />

            {/* NOTIFICATIONS */}
            <Route path="/notifications" element={<NotificationsPage />} />

            {/* PLANS */}
            <Route path="/plans" element={<PlansPage />} />
            <Route path="/create-plan" element={<CreatePlanModal />} />
            <Route path="/edit-plan/:id" element={<UpdatePlanModal />} />
            <Route path="/plans/:planId" element={<SinglePlanView />} />

            {/* PROGRESS */}
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/create-progress" element={<CreateProgressPage />} />
            <Route path="/edit-progress/:id" element={<EditProgressPage />} />
            <Route path="/progress/:progressId" element={<SingleProgressPage />} />
            
            {/* CHAT */}
            <Route path="/chat" element={<ChatHomePage />} />
          </Routes>
        </div>
      </BrowserRouter>

      <ToastContainer />
    </div>
  );
};

export default App;
