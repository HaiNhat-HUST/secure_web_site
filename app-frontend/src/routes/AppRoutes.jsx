import { Routes, Route } from "react-router-dom";
import Home from "../pages/JobNewsfeed";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard.jsx";
import Profile from "../pages/Profile"; // Giả sử đây là trang Profile chính
import ProtectedRoute from "../components/ProtectedRoute";
import AuthCallback from "../pages/AuthCallback";
import RoleSelection from "../pages/RoleSelection";
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import JobNewsfeed from '../pages/JobNewsfeed';
import JobDetail from '../pages/JobDetail';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<JobNewsfeed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/newfeeds" element={<JobNewsfeed />} />
        <Route path="/jobs/:jobId" element={<JobDetail />} />
      </Route>

      {/* private route - need authentication */}
      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<Home />} /> 
    </Routes>
  );
};

export default AppRoutes;