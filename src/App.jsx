import { useEffect } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/authStore";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import NoteInput from "./pages/NoteInput";
import ModeSelect from "./pages/ModeSelect";
import ExplainView from "./pages/ExplainView";
import StudySession from "./pages/StudySession";
import Results from "./pages/Results";
import History from "./pages/History";
import Settings from "./pages/Settings";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Account from "./pages/Account";
// Add to imports
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";


import useThemeStore from "./store/themeStore";

const App = () => {
  const { fetchUser } = useAuthStore();
  const { isDark } = useThemeStore();
  const location = useLocation();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);
  return (
    <div className="theme-transition">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/new"
            element={
              <ProtectedRoute>
                <NoteInput />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/:id/mode"
            element={
              <ProtectedRoute>
                <ModeSelect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/:id/explain"
            element={
              <ProtectedRoute>
                <ExplainView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/:id/study"
            element={
              <ProtectedRoute>
                <StudySession />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/:id/results"
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            }
          />
          <Route
            path="/privacy"
            element={
              <ProtectedRoute>
                <PrivacyPolicy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default App;
