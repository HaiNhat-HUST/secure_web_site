import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center text-center p-6">
      {/* Banner */}
      <div className="w-full h-64 bg-cover bg-center flex items-center justify-center text-white" style={{ backgroundImage: "url('/images/banner.jpg')" }}>
        <h1 className="text-5xl font-bold shadow-md">Chào mừng đến với JobHub</h1>
      </div>
      
      {/* Giới thiệu */}
      <section className="my-10 max-w-4xl">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">Kết nối ứng viên và nhà tuyển dụng</h2>
        <p className="text-lg text-gray-700">Nền tảng giúp bạn tìm kiếm công việc mơ ước hoặc tuyển dụng nhân tài phù hợp.</p>
      </section>
      
      {/* Slogan */}
      <section className="bg-blue-600 text-white py-10 w-full">
        <h3 className="text-2xl font-bold">"Cơ hội nghề nghiệp trong tầm tay bạn"</h3>
      </section>
      
      {/* Thành tựu */}
      <section className="my-10 max-w-4xl">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Thành tựu của chúng tôi</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold text-blue-600">10,000+</h3>
            <p>Việc làm đã đăng</p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold text-green-600">5,000+</h3>
            <p>Ứng viên đã tìm được việc</p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold text-yellow-600">1,000+</h3>
            <p>Nhà tuyển dụng đang hoạt động</p>
          </div>
        </div>
      </section>
      
      {/* Hành động */}
      <div className="flex space-x-4 my-10">
        <Link to="/jobs" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition">
          Xem tin tuyển dụng
        </Link>
        <Link to="/candidates" className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition">
          Tìm ứng viên
        </Link>
      </div>
    </div>
  );
}
