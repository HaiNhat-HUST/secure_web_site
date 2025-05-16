import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
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


const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Route>
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route element={<MainLayout />}>
        {/* ProtectedRoute bao bọc các route cần đăng nhập */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Trang Profile của người dùng hiện tại */}
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Fallback route - Nên hiển thị trang 404 Not Found */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
      <Route path="*" element={<Home />} /> {/* Tạm thời về Home */}
    </Routes>
  );
};

export default AppRoutes;