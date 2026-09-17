import { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Dashboard } from "./pages/Dashboard";
import { Analyze } from "./pages/Analyze";
import { Results } from "./pages/Results";
import { Reports } from "./pages/Reports";
import { History } from "./pages/History";
import { Settings } from "./pages/Settings";
import { Model } from "./pages/Model";
import { Dataset } from "./pages/Dataset";
import { Login } from "./pages/Login";
import { Landing } from "./pages/Landing";
import { useAuth } from "./auth/useAuth";

function PublicHeader({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (value: boolean) => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-surface/90 px-5 backdrop-blur sm:px-8">
      <a href="#/" className="flex items-center gap-3 text-sm font-semibold tracking-tight text-text-primary">
        <span className="flex h-8 w-8 items-center justify-center rounded border border-border bg-surface-secondary font-mono text-xs">ID</span>
        Image Detection
      </a>
      <div className="flex items-center gap-2">
        <button onClick={() => setDarkMode(!darkMode)} className="flex h-9 w-9 items-center justify-center rounded border border-border text-text-secondary hover:bg-surface-secondary" aria-label="Toggle theme">
          {darkMode ? "☼" : "◐"}
        </button>
        <a href="#/login" className="rounded border border-border px-3 py-2 text-xs font-medium text-text-primary hover:bg-surface-secondary">Sign In</a>
      </div>
    </header>
  );
}

function AppContent({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (value: boolean) => void }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const publicRoute = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/auth";

  if (!isAuthenticated && publicRoute) {
    return (
      <div className="min-h-screen bg-background text-text-primary">
        {location.pathname === "/" && <PublicHeader darkMode={darkMode} setDarkMode={setDarkMode} />}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth" element={<Login />} />
        </Routes>
      </div>
    );
  }

  if (!isAuthenticated && !publicRoute) return <Navigate to="/login" state={{ from: location }} replace />;

  return (
    <div className="min-h-screen flex bg-background text-text-primary transition-colors duration-200 antialiased">
      <Sidebar isCollapsed={false} setIsCollapsed={() => {}} mobileOpen={false} setMobileOpen={() => {}} />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} onOpenMobileMenu={() => {}} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/results/:id" element={<Results />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/model" element={<Model />} />
            <Route path="/dataset" element={<Dataset />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("image_detection_theme") || localStorage.getItem("imageguard_theme");
    return saved ? saved === "dark" : true;
  });

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem("image_detection_sidebar_collapsed") === "true";
  });

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("image_detection_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("image_detection_theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("image_detection_sidebar_collapsed", isCollapsed ? "true" : "false");
  }, [isCollapsed]);

  return (
    <Router>
      <AuthProvider>
        <AppContent darkMode={darkMode} setDarkMode={setDarkMode} />
        {false && (
        <div className="min-h-screen flex bg-background text-text-primary transition-colors duration-200 antialiased selection:bg-accent/20 selection:text-accent">
          {/* Collapsible Left Navigation Sidebar */}
          <Sidebar
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />

          {/* Main App Content Area */}
          <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
            {/* Minimal Top Header with Mobile Hamburger, Page Title, Theme Toggle, Profile */}
            <Header
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              onOpenMobileMenu={() => setMobileOpen(true)}
            />

            {/* Scrollable Viewport */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <Routes>
                {/* Core Public Navigation */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/analyze" element={<Analyze />} />
                <Route path="/results/:id" element={<Results />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/model" element={<Model />} />
                <Route path="/dataset" element={<Dataset />} />
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  }
                />

                {/* Settings & Evaluation Controls */}
                <Route
                  path="/settings"
                  element={
                    <Settings darkMode={darkMode} setDarkMode={setDarkMode} />
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </main>

            {/* Clean Minimal Technical Footer */}
            <footer className="border-t border-border py-3 px-6 text-xs text-text-muted bg-surface/50 shrink-0">
              <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                <span className="font-mono text-[11px]">
                  Image Detection v4.0 · Deep Learning Classification
                </span>
                <span className="font-mono text-[11px]">
                  EfficientNet-B0 · Supporting Signal Analysis
                </span>
              </div>
            </footer>
          </div>
        </div>)}
      </AuthProvider>
    </Router>
  );
}

export default App;
