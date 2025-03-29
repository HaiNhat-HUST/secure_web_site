import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/RecruiterDashboard";
import Profile from "../pages/Profile";
// import PrivateRoute from "../components/PrivateRoute";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>


        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
