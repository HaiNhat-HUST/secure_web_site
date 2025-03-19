import { Outlet } from "react-router-dom";
import Footer from "./../components/Footer";
import Header from "./../components/Header"

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <Header />

      {/* Nội dung trang */}
      <main className="">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
