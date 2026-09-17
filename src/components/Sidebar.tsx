import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Scan,
  History as HistoryIcon,
  FileText,
  Cpu,
  Settings as SettingsIcon,
  LogOut,
  LogIn,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { useAuth } from "../auth/useAuth";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleSignOut = async () => {
    await signOut();
    setMobileOpen(false);
    navigate("/");
  };

  const navGroups = [
    {
      label: "MAIN",
      items: [
        { name: "Dashboard", path: "/", icon: LayoutDashboard },
        { name: "Analyze", path: "/analyze", icon: Scan },
        { name: "History", path: "/history", icon: HistoryIcon, authRequired: true },
      ],
    },
    {
      label: "TOOLS",
      items: [
        { name: "Reports", path: "/reports", icon: FileText },
        { name: "Model Information", path: "/model", icon: Cpu },
      ],
    },
    {
      label: "SYSTEM",
      items: [
        { name: "Settings", path: "/settings", icon: SettingsIcon },
      ],
    },
  ];

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || "Investigator";
  const userEmail = user?.email || "user@imagedetection.io";

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[var(--sidebar-background)] border-r border-[var(--sidebar-border)] transition-all duration-200">
      
      {/* 1. Header / Brand */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-border shrink-0">
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5 overflow-hidden"
        >
          <div className="h-7 w-7 rounded border border-border bg-surface-secondary flex items-center justify-center shrink-0">
            <Scan className="h-4 w-4 text-text-primary" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <span className="font-semibold text-sm tracking-tight text-text-primary block leading-none">
                Image Detection
              </span>
              <span className="text-[10px] font-mono text-text-muted leading-none mt-1 block">
                Deep Learning v4.0
              </span>
            </div>
          )}
        </Link>

        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-surface-secondary"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Desktop collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1 rounded border border-border bg-surface-secondary text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* 2. Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter(item => !item.authRequired || isAuthenticated);
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 pb-1 text-[10px] font-mono tracking-wider text-text-muted uppercase">
                  {group.label}
                </div>
              )}
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    title={isCollapsed ? item.name : undefined}
                    className={`flex items-center gap-3 px-3 py-2 rounded text-xs transition-colors ${
                      active
                        ? "bg-surface-secondary text-text-primary font-medium border border-border"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary/70 border border-transparent"
                    } ${isCollapsed ? "justify-center px-2" : ""}`}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-text-secondary" />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* 3. Bottom Section: User Profile & Auth */}
      <div className="p-3 border-t border-border bg-surface shrink-0">
        {isAuthenticated ? (
          <div className="space-y-2">
            {!isCollapsed ? (
              <div className="flex items-center justify-between gap-2 p-1.5 rounded bg-surface-secondary border border-border">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-border flex items-center justify-center text-[10px] font-mono font-medium text-text-primary shrink-0">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate min-w-0">
                    <p className="text-xs font-medium text-text-primary truncate">{userName}</p>
                    <p className="text-[10px] text-text-muted font-mono truncate">{userEmail}</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-1 rounded text-text-muted hover:text-red-400 transition-colors cursor-pointer shrink-0"
                  title="Sign out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center p-2 rounded text-text-muted hover:text-red-400 hover:bg-surface-secondary transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div>
            {!isCollapsed ? (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded text-xs font-medium border border-border bg-surface-secondary hover:bg-surface-hover text-text-primary transition-colors"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In with Google</span>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center p-2 rounded text-text-primary hover:bg-surface-secondary transition-colors"
                title="Sign In"
              >
                <LogIn className="h-4 w-4" />
              </Link>
            )}
          </div>
        )}
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile, fixed width on md+) */}
      <aside
        className={`hidden md:block shrink-0 h-screen sticky top-0 transition-all duration-200 z-30 ${
          isCollapsed ? "w-16" : "w-56"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer Content */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 w-64 z-50 transform transition-transform duration-200 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
