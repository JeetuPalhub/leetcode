import React from "react";
import { User, Code, LogOut, Sun, Moon, Code2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import LogoutButton from "./LogoutButton";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();

  // Check if we're on the landing page
  const isLandingPage = location.pathname === "/" && !authUser;

  return (
    <nav className="sticky top-0 z-50 w-full py-4 px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between bg-base-200/80 backdrop-blur-xl border border-base-300/50 rounded-2xl px-6 py-3 shadow-lg">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight hidden sm:block">
            LeetLab
          </span>
        </Link>

        {/* Center Navigation - Show on landing page only */}
        {isLandingPage && (
          <div className="hidden md:flex items-center gap-1 bg-base-300/50 rounded-xl p-1">
            <a href="#features" className="px-4 py-2 text-sm font-medium text-base-content/70 hover:text-base-content hover:bg-base-100 rounded-lg transition-all">
              Features
            </a>
            <a href="#problems" className="px-4 py-2 text-sm font-medium text-base-content/70 hover:text-base-content hover:bg-base-100 rounded-lg transition-all">
              Problems
            </a>
            <a href="#testimonials" className="px-4 py-2 text-sm font-medium text-base-content/70 hover:text-base-content hover:bg-base-100 rounded-lg transition-all">
              Testimonials
            </a>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl bg-base-300/50 hover:bg-base-300 flex items-center justify-center transition-all duration-200"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {authUser ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="cursor-pointer">
                <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-primary/30 hover:ring-primary/60 transition-all">
                  <img
                    src={authUser?.image || "https://avatar.iran.liara.run/public/boy"}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </label>
              <div
                tabIndex={0}
                className="dropdown-content mt-4 z-[1] bg-base-100 rounded-2xl w-64 shadow-2xl border border-base-200 overflow-hidden"
              >
                {/* User Header */}
                <div className="bg-gradient-to-r from-primary to-secondary p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white/30">
                      <img
                        src={authUser?.image || "https://avatar.iran.liara.run/public/boy"}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-white truncate">{authUser?.name}</p>
                      <p className="text-xs text-white/70 truncate">{authUser?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-base-200 transition-colors"
                  >
                    <User className="w-4 h-4 text-primary" />
                    My Profile
                  </Link>

                  {authUser?.role === "ADMIN" && (
                    <Link
                      to="/add-problem"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-base-200 transition-colors"
                    >
                      <Code className="w-4 h-4 text-secondary" />
                      Add Problem
                    </Link>
                  )}

                  <div className="my-2 border-t border-base-200"></div>

                  <LogoutButton className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-error hover:bg-error/10 transition-colors w-full">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </LogoutButton>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-5 py-2.5 text-sm font-medium text-base-content/70 hover:text-base-content transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
