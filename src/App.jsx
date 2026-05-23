import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import Account from "./pages/Account";


import useThemeStore from "./store/themeStore";

const App = () => {
  const { fetchUser } = useAuthStore();
  const { isDark } = useThemeStore();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      {/* Protected */}
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
      // Add inside Routes:
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
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
