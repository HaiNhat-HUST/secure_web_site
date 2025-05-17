// src/routes/AppRoutes.jsx 

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

const AppRoutes = () => {
  return (
    // KHÔNG CÓ <Router> và <AuthProvider> ở đây
    <Routes>
      {/* Public routes */}

      <Route element={<MainLayout />}> {/* Layout cho các trang public/chung */}
        <Route path="/" element={<Home />} />
        {/* Có thể cần AuthLayout riêng cho Login/Register */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/select-role" element={<RoleSelection />} />
      </Route>

      {/* Protected routes */}

      <Route element={<MainLayout />}>
        {/* ProtectedRoute bao bọc các route cần đăng nhập */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Trang Profile của người dùng hiện tại */}
          <Route path="/profile" element={<Profile />} />
          {/*<Route path="/profile/:userId" element={<Profile />} />*/}
        </Route>
      </Route>

      {/* Fallback route - Nên hiển thị trang 404 Not Found */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
      <Route path="*" element={<Home />} /> {/* Tạm thời về Home */}
    </Routes>
  );
};

export default AppRoutes;