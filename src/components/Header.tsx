import React from "react";
import { useLocation } from "react-router-dom";
import { Menu, Moon, Sun } from "lucide-react";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  onOpenMobileMenu,
}) => {
  const location = useLocation();

  // Determine current page title
  const getPageTitle = (pathname: string): string => {
    if (pathname === "/") return "Dashboard";
    if (pathname.startsWith("/analyze")) return "Analyze";
    if (pathname.startsWith("/results")) return "Detection Result";
    if (pathname.startsWith("/history")) return "History";
    if (pathname.startsWith("/reports")) return "Reports";
    if (pathname.startsWith("/model")) return "Model Information";
    if (pathname.startsWith("/dataset")) return "Dataset";
    if (pathname.startsWith("/settings")) return "Settings";
    if (pathname.startsWith("/login")) return "Authentication";
    return "";
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="sticky top-0 z-20 w-full h-14 border-b border-[var(--header-border)] bg-[var(--header-background)]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between transition-colors">
      
      {/* Left: Mobile hamburger & title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden flex h-11 w-11 items-center justify-center rounded border border-border bg-surface-secondary text-text-secondary hover:text-text-primary"
          aria-label="Open navigation"
          aria-expanded={false}
        >
          <Menu className="h-4 w-4" />
        </button>

        <span className="font-medium text-xs sm:text-sm text-text-primary">
          {pageTitle}
        </span>
      </div>

      {/* Right: Theme Toggle & User Avatar */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex h-8 w-8 items-center justify-center rounded border border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
          aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </button>

      </div>

    </header>
  );
};
