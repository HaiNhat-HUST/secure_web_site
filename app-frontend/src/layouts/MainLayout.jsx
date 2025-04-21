import { Outlet } from "react-router-dom";
import Footer from "./../components/Footer";
import Navbar from "./../components/Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
