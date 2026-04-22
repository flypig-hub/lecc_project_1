import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "./components/common/ToastContainer";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import "./App.css";

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-black text-yellow-400 font-pixel">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leaderboard"
                element={
                  <ProtectedRoute>
                    <LeaderboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            <ToastContainer />
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
