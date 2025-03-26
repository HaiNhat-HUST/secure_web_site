# Recruitment Management Web Application

## 📝 Tổng quan

Đây là một ứng dụng web quản lý tuyển dụng được xây dựng bằng `React` cho frontend và `(Backend Technology - ví dụ: Node.js/Express, Python/Django, etc.)` cho backend. Dự án này nhằm mục đích tạo ra một nền tảng giúp nhà tuyển dụng đăng tin tuyển dụng, quản lý ứng viên và giúp ứng viên tìm kiếm, ứng tuyển vào các vị trí phù hợp.

## ✨ Tính năng chính (Dự kiến)

*   **Nhà tuyển dụng:**
    *   Đăng nhập / Đăng ký
    *   Tạo và quản lý tin tuyển dụng (CRUD)
    *   Xem và quản lý danh sách ứng viên ứng tuyển
    *   Quản lý hồ sơ công ty
    *   Dashboard thống kê (số lượng tin đăng, ứng viên,...)
*   **Ứng viên:**
    *   Đăng nhập / Đăng ký
    *   Tạo và quản lý hồ sơ cá nhân (Profile)
    *   Tìm kiếm việc làm (Newsfeed)
    *   Xem chi tiết tin tuyển dụng (Post Detail)
    *   Ứng tuyển vào vị trí công việc

## 🚀 Công nghệ sử dụng

*   **Frontend:**
    *   `React.js`
    *   `(Ví dụ: Redux/Zustand/Context API for State Management)`
    *   `(Ví dụ: React Router for Routing)`
    *   `(Ví dụ: Axios for API Calls)`
    *   `(Ví dụ: Material UI / Ant Design / Tailwind CSS for Styling)`
*   **Backend:**
    *   `(Ví dụ: Node.js with Express.js)`
    *   `(Ví dụ: RESTful API / GraphQL)`
*   **Database:**
    *   `(Ví dụ: MongoDB / PostgreSQL / MySQL)`
*   **Khác:**
    *   `Git & GitHub for Version Control`

## 🏗️ Cấu trúc thư mục dự án

```text
recruitment-management/
├── backend/                  # Thư mục chứa code backend
|--------------
|   TODO
|--------------
│
├── frontend/                 # Thư mục chứa code frontend (React) - có thể đổi tên từ app-frontend
│   ├── public/               # Chứa file public (index.html, favicon,...)
│   ├── src/
│   │   ├── assets/           # Chứa tài nguyên tĩnh (images, fonts,...)
│   │   ├── components/       # Các UI component tái sử dụng
│   │   ├── contexts/         # Hoặc /store - Quản lý state global (Context API, Redux,...)
│   │   ├── hooks/            # Các custom React hooks
│   │   ├── layouts/          # Bố cục chung cho các trang (Navbar, Footer, Sidebar)
│   │   ├── pages/            # Các component tương ứng với từng trang (Dashboard, Profile, Newsfeed)
│   │   ├── routes/           # Cấu hình routing
│   │   ├── services/         # Hoặc /api - Các hàm gọi API backend
│   │   ├── styles/           # Hoặc /theme - Global styles, theme configuration
│   │   ├── utils/            # Các hàm tiện ích chung
│   │   ├── App.js            # Component gốc của ứng dụng
│   │   └── index.js          # Điểm khởi chạy ứng dụng React
│   ├── .env.example          # File ví dụ biến môi trường (API URL,...)
│   ├── .gitignore
│   └── package.json
│
├── .gitignore                # File gitignore chung cho toàn project
├── 
└── README.md                 # File README này

```

*Lưu ý:* Tên thư mục `app-frontend` trong README gốc của bạn có thể đổi thành `frontend` cho nhất quán và dễ hiểu hơn.

## 🛠️ Cài đặt và Chạy dự án

**Yêu cầu:**

*   Node.js (`v16` trở lên) & `npm` / `yarn`
*   Git
*   `(Ví dụ: MongoDB / PostgreSQL Server)` - Tùy thuộc vào DB bạn chọn

**Các bước:**

1.  **Clone repository:**
    ```bash
    git clone <your-repository-url>
    cd recruitment-management
    ```

2.  **Cài đặt Backend:**
    ```bash
    cd backend
    npm install # hoặc yarn install
    # Sao chép .env.example thành .env và cấu hình các biến môi trường (DB connection string, JWT secret,...)
    cp .env.example .env
    # Chỉnh sửa file .env với thông tin của bạn
    ```

3.  **Cài đặt Frontend:**
    ```bash
    cd ../frontend # hoặc cd ../app-frontend nếu bạn giữ tên cũ
    npm install # hoặc yarn install
    # Sao chép .env.example thành .env và cấu hình các biến môi trường (API_BASE_URL,...)
    cp .env.example .env
    # Chỉnh sửa file .env với thông tin của bạn (ví dụ: API_BASE_URL=http://localhost:5000/api)
    ```

4.  **Chạy Backend:**
    ```bash
    cd ../backend
    npm run dev # Giả sử bạn có script "dev" trong package.json để chạy server với nodemon
    # Hoặc npm start
    ```
    *Backend sẽ chạy tại địa chỉ (ví dụ: `http://localhost:5000`)*

5.  **Chạy Frontend:**
    ```bash
    cd ../frontend # hoặc cd ../app-frontend
    npm run dev # Hoặc yarn dev
    ```
    *Frontend sẽ chạy tại địa chỉ (ví dụ: `http://localhost:3000`)*

## 📋 Kế hoạch Phát triển (TODO)

Chi tiết kế hoạch phát triển và danh sách công việc được theo dõi tại file [TODO.md](./TODO.md).

## 🤝 Đóng góp

| Mã Sinh Viên | Tên Sinh Viên        |
| :----------- | :------------------- |
| 2022xxxx     | Lê Hải Nhật          |
| 2022xxxx     | Nguyễn Phương Linh   |
| 20225544     | Hạ Nhật Duy          |