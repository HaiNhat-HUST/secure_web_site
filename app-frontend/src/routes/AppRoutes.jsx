import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/RecruiterDashboard";
import Profile from "../pages/Profile";
import ProtectedRoute from "../components/ProtectedRoute";
import { AuthProvider } from "../context/AuthContext";
import AuthCallback from "../pages/AuthCallback";

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Route>

          {/* Protected routes */}
          <Route element={<MainLayout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;
