import { Bell, MessageCircle, Menu, X } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuRef]);

  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // CSS for animations
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
  `;

  return (
    <>
      <style>{styleTag}</style>
      <div 
        className={`w-full transition-all duration-300 relative ${
          isScrolled 
            ? "bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg" 
            : "bg-gradient-to-r from-indigo-600 to-violet-600"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-4 relative z-10">
          {/* Logo */}
          <Link to={"/"} className="flex items-center group">
            <div className="relative overflow-hidden float">
              <div className="text-white text-2xl md:text-3xl font-extrabold tracking-tight group-hover:scale-110 transform transition-all duration-300 drop-shadow-md shine">
                EDU HUB
              </div>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to={"/"} 
              className={`px-3 py-2 transition-all duration-200 relative text-white text-sm font-medium ${
                isActive("/") 
                  ? "font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white" 
                  : "hover:text-white/80"
              }`}
            >
              Posts
            </Link>
            
            <Link 
              to={"/plans"} 
              className={`px-3 py-2 transition-all duration-200 relative text-white text-sm font-medium ${
                isActive("/plans") 
                  ? "font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white" 
                  : "hover:text-white/80"
              }`}
            >
              Plans
            </Link>
            
            <Link 
              to={"/progress"} 
              className={`px-3 py-2 transition-all duration-200 relative text-white text-sm font-medium ${
                isActive("/progress") 
                  ? "font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white" 
                  : "hover:text-white/80"
              }`}
            >
              Progress
            </Link>
            
            <div className="ml-4 flex items-center space-x-1">
              <Link 
                to={"/notifications"} 
                className={`p-2 rounded-full transition-colors relative ${
                  isActive("/notifications") ? "bg-white/10 text-white" : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Bell className="w-5 h-5" />
              </Link>
              
              <Link 
                to={"/chat"} 
                className={`p-2 rounded-full transition-colors relative ${
                  isActive("/chat") ? "bg-white/10 text-white" : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
              >
                <MessageCircle className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Auth Button */}
          <div className="hidden md:block">
            <Link
              to={isLoggedIn ? "/profile" : "/login"}
              className="inline-flex items-center justify-center rounded-full transition-all duration-200 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium px-5 py-1.5 hover:bg-white/20"
            >
              {isLoggedIn ? "Profile" : "Login"}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Animated accent line */}
        <div className="h-0.5 w-full bg-white/20"></div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="fixed inset-x-0 top-[69px] z-50 md:hidden"
        >
          <div className="bg-indigo-600 shadow-xl py-2 px-4 space-y-1">
            <Link 
              to={"/"} 
              className={`block px-4 py-3 rounded-lg ${
                isActive("/") 
                  ? "bg-white/10 text-white font-medium" 
                  : "text-white/90 hover:bg-white/10 hover:text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Posts
            </Link>
            
            <Link 
              to={"/plans"} 
              className={`block px-4 py-3 rounded-lg ${
                isActive("/plans") 
                  ? "bg-white/10 text-white font-medium" 
                  : "text-white/90 hover:bg-white/10 hover:text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Plans
            </Link>
            
            <Link 
              to={"/progress"} 
              className={`block px-4 py-3 rounded-lg ${
                isActive("/progress") 
                  ? "bg-white/10 text-white font-medium" 
                  : "text-white/90 hover:bg-white/10 hover:text-white"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Progress
            </Link>
            
            <div className="flex items-center justify-start space-x-1 px-4 py-3">
              <Link 
                to={"/notifications"} 
                className={`p-2 rounded-full ${
                  isActive("/notifications") 
                    ? "bg-white/10 text-white" 
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Bell className="w-5 h-5" />
              </Link>
              
              <Link 
                to={"/chat"} 
                className={`p-2 rounded-full ${
                  isActive("/chat") 
                    ? "bg-white/10 text-white" 
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <MessageCircle className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="px-4 py-3">
              <Link
                to={isLoggedIn ? "/profile" : "/login"}
                className="block w-full text-center bg-white/10 border border-white/20 text-white font-medium px-6 py-2 rounded-lg hover:bg-white/20 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {isLoggedIn ? "Profile" : "Login"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
