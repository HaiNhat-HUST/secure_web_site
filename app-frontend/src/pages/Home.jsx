import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center">
      {/* Hero Section */}
      <div className="relative w-full h-[380px] flex items-center justify-center overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-white text-5xl md:text-6xl font-extrabold drop-shadow-lg mb-3">
            Chào mừng đến với <span className="text-blue-300">Employmee</span>
          </h1>
          <p className="text-white text-lg md:text-2xl font-medium drop-shadow mb-6">
            Nơi kết nối ứng viên & nhà tuyển dụng hàng đầu Việt Nam!
          </p>
          <div className="flex gap-4">
            <Link
              to="/newfeeds"
              className="bg-blue-400 text-blue-800 px-6 py-3 rounded-full font-semibold text-lg shadow hover:bg-yellow-500 transition"
            >
              Bắt đầu tìm kiếm
            </Link>
            
    </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-40" />
      </div>

      {/* Features Section */}
      <section className="max-w-5xl w-full mt-12 px-6 grid gap-10 md:grid-cols-3">
        <div className="flex flex-col items-center bg-white shadow-lg rounded-2xl py-8 px-6 hover:scale-105 transition">
          <svg className="w-12 h-12 text-blue-500 mb-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20l9 2-7-7v-7l-2-5-2 5v7l-7 7 9-2z"/>
          </svg>
          <h3 className="text-xl font-semibold text-blue-600 mb-2">10,000+ việc làm</h3>
          <p className="text-gray-600 text-center">Đa dạng lĩnh vực, cập nhật liên tục các cơ hội nghề nghiệp.</p>
        </div>
        <div className="flex flex-col items-center bg-white shadow-lg rounded-2xl py-8 px-6 hover:scale-105 transition">
          <svg className="w-12 h-12 text-green-500 mb-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="text-xl font-semibold text-green-600 mb-2">5,000+ ứng viên thành công</h3>
          <p className="text-gray-600 text-center">Mang bạn đến gần hơn với công việc mơ ước của mình.</p>
        </div>
        <div className="flex flex-col items-center bg-white shadow-lg rounded-2xl py-8 px-6 hover:scale-105 transition">
          <svg className="w-12 h-12 text-yellow-500 mb-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c2.5 0 4.5 2 4.5 4.5S14.5 17 12 17s-4.5-2-4.5-4.5S9.5 8 12 8z" />
          </svg>
          <h3 className="text-xl font-semibold text-yellow-600 mb-2">1,000+ nhà tuyển dụng uy tín</h3>
          <p className="text-gray-600 text-center">Đối tác lớn đồng hành cùng EmployMee trên toàn quốc.</p>
        </div>
      </section>

      {/* About & Slogan */}
      <section className="mt-14 max-w-3xl w-full mx-auto bg-white/80 rounded-2xl shadow-md px-10 py-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-5">Kết nối ứng viên và nhà tuyển dụng</h2>
        <p className="text-lg text-gray-700 mb-6">Nền tảng giúp bạn tìm kiếm công việc mơ ước hoặc tuyển dụng nhân tài phù hợp dễ dàng, chuyên nghiệp.</p>
        <div className="bg-blue-100 text-blue-800 p-5 rounded-lg text-xl font-semibold italic tracking-wide shadow-inner">
          "Cơ hội nghề nghiệp trong tầm tay bạn"
        </div>
      </section>
      
    </div>
  );
}
