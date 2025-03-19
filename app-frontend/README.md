# Usage
```bash
# for running frontend
npm run dev
```
Then access localhost:3000 

# Folder Structure
```
app-frontend/
│── node_modules/                # Thư viện cài đặt từ npm
│── public/                      # Chứa file tĩnh như favicon, ảnh, fonts, v.v.
│── src/                         # Code chính của ứng dụng
│   ├── assets/                  # Ảnh, icons, fonts, v.v.
│   ├── components/              # Các component dùng chung
│   │   ├── Button.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Sidebar.jsx
│   │   ├── InputField.jsx
│   │   ├── PrivateRoute.jsx      # Bảo vệ route (nếu cần đăng nhập)
│   │   ├── Loader.jsx            # Hiệu ứng loading
│   ├── pages/                    # Chứa các trang chính của ứng dụng
│   │   ├── Home.jsx              # Trang chủ
│   │   ├── Login.jsx             # Trang đăng nhập
│   │   ├── Register.jsx          # Trang đăng ký
│   │   ├── Newsfeeds.jsx         # Trang bảng tin
│   │   ├── Profile.jsx           # Trang cá nhân
│   │   ├── Settings.jsx          # Trang cài đặt
│   ├── layouts/                  # Các bố cục trang
│   │   ├── MainLayout.jsx        # Layout chính (Navbar, Sidebar, Footer)
│   │   ├── AuthLayout.jsx        # Layout cho Login, Register
│   ├── routes/                   # Định nghĩa các route
│   │   ├── AppRoutes.jsx
│   ├── services/                 # API services (fetch dữ liệu từ backend)
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── postService.js
│   ├── store/                    # Quản lý state (Redux/Zustand/Recoil)
│   │   ├── authSlice.js
│   │   ├── userSlice.js
│   ├── hooks/                    # Các custom hooks
│   │   ├── useAuth.js
│   │   ├── useFetch.js
│   ├── styles/                    # CSS/SCSS (hoặc Tailwind config)
│   │   ├── global.css
│   │   ├── variables.css
│   ├── App.jsx                    # Component gốc
│   ├── main.jsx                    # Entry point
│── index.html                      # Template chính
│── vite.config.js                   # Cấu hình Vite
│── package.json                     # Thông tin dự án
│── README.md                         # Hướng dẫn dự án
```