import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Moon, Sun, Menu, X, LogOut, Settings as SettingsIcon } from "lucide-react";
import { useAuth } from "../auth/useAuth";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  // Navigation items based on auth state
  const navLinks = [
    { name: "Analyze", path: "/analyze" },
    ...(isAuthenticated ? [{ name: "History", path: "/history" }] : []),
    { name: "Model", path: "/model" },
    { name: "Dataset", path: "/dataset" },
    ...(isAuthenticated ? [{ name: "Settings", path: "/settings" }] : []),
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await signOut();
    navigate("/");
  };

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || "Investigator";
  const userEmail = user?.email || "user@imageguard.io";
  const userAvatar = user?.user_metadata?.avatar_url;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/90 backdrop-blur-md transition-colors">
      <div className="max-w-[1200px] mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-semibold text-base tracking-tight text-text-primary">
              ImageGuard
            </span>
            <span className="text-[11px] font-mono text-text-muted px-1.5 py-0.5 rounded border border-border bg-surface-secondary">
              v1.0
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 rounded transition-colors ${
                  isActive(link.path)
                    ? "bg-surface-secondary text-text-primary font-semibold"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary/60"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          
          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex h-8 w-8 items-center justify-center rounded border border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
            aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
          >
            {darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>

          {/* Auth State Button / Profile Dropdown */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 h-8 px-2 rounded border border-border bg-surface hover:bg-surface-secondary transition-colors cursor-pointer"
                aria-label="User profile menu"
              >
                {userAvatar ? (
                  <img src={userAvatar} alt="User Avatar" className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-surface-secondary flex items-center justify-center text-[10px] font-mono font-medium text-text-primary">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline text-xs font-medium text-text-primary max-w-[100px] truncate">
                  {userName.split(" ")[0]}
                </span>
              </button>

              {/* Account Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-surface shadow-lg py-1.5 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="font-medium text-text-primary truncate">{userName}</p>
                    <p className="text-[11px] text-text-muted truncate font-mono">{userEmail}</p>
                  </div>
                  
                  <Link
                    to="/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
                  >
                    <SettingsIcon className="w-3.5 h-3.5" />
                    <span>Settings</span>
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-red-400 hover:bg-surface-secondary transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded text-xs font-medium h-8 px-3 border border-border bg-surface hover:bg-surface-secondary text-text-primary transition-colors"
            >
              Sign In
            </Link>
          )}

          {/* Analyze Primary CTA */}
          <Link
            to="/analyze"
            className="hidden sm:inline-flex items-center justify-center rounded text-xs font-medium h-8 px-3.5 bg-accent text-accent-contrast hover:opacity-90 transition-opacity"
          >
            Analyze Image
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded border border-border bg-surface text-text-secondary hover:text-text-primary"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded text-sm ${
                isActive(link.path)
                  ? "bg-surface-secondary text-text-primary font-medium"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="pt-2 border-t border-border mt-2 space-y-2">
            {isAuthenticated ? (
              <div className="space-y-1">
                <div className="px-3 py-1 text-xs text-text-muted font-mono truncate">
                  Signed in as {userEmail}
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 text-xs text-red-400 font-medium rounded hover:bg-surface-secondary"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2 text-xs font-medium rounded border border-border bg-surface text-text-primary"
              >
                Sign In
              </Link>
            )}

            <Link
              to="/analyze"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2 text-xs font-medium rounded bg-accent text-accent-contrast"
            >
              Analyze Image
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
